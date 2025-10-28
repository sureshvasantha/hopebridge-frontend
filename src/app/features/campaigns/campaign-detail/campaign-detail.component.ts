// src/app/features/campaigns/campaign-detail/campaign-detail.component.ts
import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CampaignService } from "../../../core/services/campaign.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { ProgressBarComponent } from "../../../shared/components/progress-bar/progress-bar.component";
import { DonationFormComponent } from "../../donations/donation-form/donation-form.component";
import { ImpactStoryService } from "../../../core/services/impact-story.service";
import { CreateImpactStoryRequest } from "../../../core/models/impact-story.model";
import { FormsModule } from "@angular/forms";
import { DonationDTO } from "../../../core/models/donation.model";
@Component({
  selector: "app-campaign-detail",
  imports: [
    CommonModule,
    RouterLink,
    ProgressBarComponent,
    DonationFormComponent,
    FormsModule,
  ],
  standalone: true,
  templateUrl: "./campaign-detail.component.html",
})
export class CampaignDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private campaignService = inject(CampaignService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private impactStoryService = inject(ImpactStoryService);

  campaign = this.campaignService.selectedCampaign;

  showStoryModal = signal(false);
  loading = this.campaignService.loading;
  showDonationForm = signal(false);

  impactStories = this.impactStoryService.stories;

  newStory: CreateImpactStoryRequest = {
    title: "",
    content: "",
    campaignId: 0,
    images: [],
  };
  private submitting = signal(false);

  // Adjust import path
  donations = signal<DonationDTO[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) return;

    const campaignId = +id;
    const user = this.authService.currentUser();

    if (user?.role?.roleName === "ADMIN") {
      this.campaignService
        .getCampaignByAdminAndId(user.userId, campaignId)
        .subscribe({
          error: (error) => {
            this.toastService.error(
              "Failed to load campaign details",
              error.error?.message
            );
            console.error("Error loading campaign:", error);
          },
        });

      // Load donations for admin
      this.campaignService
        .getDonationsByCampaign(user.userId, campaignId)
        .subscribe({
          next: (d) => this.donations.set(d),
          error: (err) => {
            this.toastService.error(
              "Failed to load donations",
              err.error?.message || "Unknown error"
            );
            console.error("Error loading donations:", err);
          },
        });
    } else {
      this.campaignService.getCampaignById(campaignId).subscribe({
        error: (error) => {
          this.toastService.error(
            "Failed to load campaign details",
            error.error?.message
          );
          console.error("Error loading campaign:", error);
        },
      });
    }

    this.impactStoryService.getStoriesByCampaign(campaignId).subscribe();
  }

  toggleDonationForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.warning("Please login to donate");
      return;
    }
    this.showDonationForm.update((v) => !v);
  }

  closeStoryModal() {
    this.showStoryModal.set(false);
    this.resetStoryForm();
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.newStory.images = Array.from(input.files);
  }

  resetStoryForm() {
    this.newStory = {
      title: "",
      content: "",
      campaignId: this.newStory.campaignId,
      images: [],
    };
    this.submitting.set(false);
  }

  isSubmitting() {
    return this.submitting();
  }

  submitImpactStory() {
    if (this.submitting()) return;
    this.submitting.set(true);

    const user = this.authService.currentUser();
    if (!user || !this.authService.isAdmin()) {
      this.toastService.error("Only admins can add impact stories.");
      this.submitting.set(false);
      return;
    }

    this.impactStoryService
      .createImpactStory(user.userId, this.newStory.campaignId, this.newStory)
      .subscribe({
        next: (createdStory) => {
          this.toastService.success("Impact story added successfully!");
          this.closeStoryModal();
          const currentStories = this.impactStories();
          this.impactStories.set([createdStory, ...currentStories]);
          this.submitting.set(false);
        },
        error: (err) => {
          this.toastService.error(
            "Failed to add impact story.",
            err.error?.message || "Unknown error"
          );
          this.submitting.set(false);
        },
      });
  }
}
