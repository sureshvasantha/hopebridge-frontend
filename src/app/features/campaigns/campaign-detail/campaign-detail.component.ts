// src/app/features/campaigns/campaign-detail/campaign-detail.component.ts
import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CampaignService } from "../../../core/services/campaign.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { ProgressBarComponent } from "../../../shared/components/progress-bar/progress-bar.component";
import { DonationFormComponent } from "../../donations/donation-form/donation-form.component";

@Component({
  selector: "app-campaign-detail",
  imports: [
    CommonModule,
    RouterLink,
    ProgressBarComponent,
    DonationFormComponent,
  ],
  standalone: true,
  templateUrl: "./campaign-detail.component.html",
})
export class CampaignDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private campaignService = inject(CampaignService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  campaign = this.campaignService.selectedCampaign;
  loading = this.campaignService.loading;
  showDonationForm = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.campaignService.getCampaignById(+id).subscribe({
        error: (error) => {
          this.toastService.error("Failed to load campaign details");
          console.error("Error loading campaign:", error);
        },
      });
    }
  }

  toggleDonationForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.warning("Please login to donate");
      return;
    }
    this.showDonationForm.update((v) => !v);
  }
}
