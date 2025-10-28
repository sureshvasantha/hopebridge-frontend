import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { CampaignService } from "../../../core/services/campaign.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { CampaignStatus, CampaignType } from "../../../core/models";
import { ImgPreviewPipe } from "../../../shared/pipes/img-preview.pipe";

@Component({
  selector: "app-campaign-form",
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImgPreviewPipe],
  standalone: true,
  templateUrl: "./campaign-form.component.html",
})
export class CampaignFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  images = signal<File[]>([]);

  campaignTypes = Object.values(CampaignType);

  campaignForm = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(10)]],
    description: ["", [Validators.required, Validators.minLength(50)]],
    goalAmount: [0, [Validators.required, Validators.min(1000)]],
    startDate: ["", Validators.required],
    endDate: ["", Validators.required],
    campaignType: ["" as CampaignType, Validators.required],
    location: ["", Validators.required],
    status: [CampaignStatus.ACTIVE, Validators.required],
  });

  public CampaignStatus = CampaignStatus;
  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEditMode.set(true);
      await this.loadCampaign(+id);
    }
  }

  async loadCampaign(id: number): Promise<void> {
    this.campaignService.getCampaignById(id).subscribe(
      async (campaign) => {
        this.campaignForm.patchValue({
          title: campaign.title,
          description: campaign.description,
          goalAmount: campaign.goalAmount,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          campaignType: campaign.campaignType,
          location: campaign.location,
          status: campaign.status || CampaignStatus.ACTIVE,
        });

        const files: File[] = [];
        for (const img of campaign.images || []) {
          try {
            const response = await fetch(img.imageUrl);
            const blob = await response.blob();
            // Use the last segment of the URL as the filename
            const filename = this.extractFileName(img.imageUrl);
            const file = new File([blob], filename, { type: blob.type });
            files.push(file);
          } catch (error) {
            console.error("Failed to load image as File", error);
          }
        }
        this.images.set(files);
      },
      (error) => {
        this.toastService.error(
          "Failed to load campaign." + error.error?.message
        );
        console.error("Error fetching campaign by id:", error.error?.message);
      }
    );
  }

  private extractFileName(url: string): string {
    return url.substring(url.lastIndexOf("/") + 1);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.images.update((imgs) => [...imgs, ...newFiles]);
    }
  }

  removeImage(index: number): void {
    this.images.update((imgs) => {
      imgs.splice(index, 1);
      return [...imgs];
    });
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) {
      this.toastService.error("Please fill all required fields correctly");
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    const formValue = this.campaignForm.value;

    const request = {
      campaignId: this.isEditMode()
        ? this.route.snapshot.paramMap.get("id")
        : null,
      title: formValue.title!,
      description: formValue.description!,
      goalAmount: +formValue.goalAmount!,
      startDate: formValue.startDate!,
      endDate: formValue.endDate!,
      campaignType: formValue.campaignType!,
      location: formValue.location!,
      status: formValue.status!,
    };

    const campaignId = this.route.snapshot.paramMap.get("id");

    if (this.isEditMode() && campaignId) {
      this.campaignService
        .updateCampaign(user.userId, +campaignId, request, this.images())
        .subscribe({
          next: () => {
            this.toastService.success("Campaign updated successfully!");
            this.router.navigate(["/admin/dashboard"]);
          },
          error: (error) => {
            this.toastService.error("Failed to update campaign");
            console.error("Failed to update campaign");
            console.error("Error:", error);
          },
        });
    } else {
      this.campaignService
        .createCampaign(user.userId, request, this.images())
        .subscribe({
          next: () => {
            this.toastService.success("Campaign created successfully!");
            this.router.navigate(["/admin/dashboard"]);
          },
          error: (error) => {
            this.toastService.error("Failed to create campaign");
            console.error("Error:", error);
          },
        });
    }
  }
}
