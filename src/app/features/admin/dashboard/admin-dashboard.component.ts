import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CampaignService } from "../../../core/services/campaign.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { CampaignDTO, CampaignStatus } from "../../../core/models";

@Component({
  selector: "app-admin-dashboard",
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: "./admin-dashboard.component.html",
})
export class AdminDashboardComponent implements OnInit {
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  campaigns = this.campaignService.campaigns;
  loading = this.campaignService.loading;
  showCreateForm = signal(false);
  showConfirmModal = signal(false);
  campaignToComplete = signal<CampaignDTO | null>(null);
  stopCampaignLoading = signal(false);

  ngOnInit(): void {
    this.loadCampaigns();
  }

  // Refresh campaigns for the current admin
  loadCampaigns(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.campaignService.getCampaignsByAdmin(user.userId).subscribe({
        error: (error) => {
          this.toastService.error("Failed to load campaigns");
          console.error("Error loading campaigns:", error);
        },
      });
    }
  }
  openCompleteModal(campaign: CampaignDTO) {
    this.campaignToComplete.set(campaign);
    this.showConfirmModal.set(true);
  }
  confirmCompleteCampaign(): void {
    const campaign = this.campaignToComplete();
    const user = this.authService.currentUser();
    if (!user || !campaign) {
      this.showConfirmModal.set(false);
      return;
    }

    this.campaignService
      .updateCampaignStatus(
        user.userId,
        campaign.campaignId,
        CampaignStatus.COMPLETED
      )
      .subscribe({
        next: () => {
          this.toastService.success("Campaign marked as completed!");
          this.showConfirmModal.set(false);
          this.campaignToComplete.set(null);
          this.loadCampaigns();
        },
        error: () => {
          this.toastService.error("Failed to complete campaign");
          this.showConfirmModal.set(false);
        },
      });
  }

  getCampaignsByStatus(status: string): CampaignDTO[] {
    return this.campaigns().filter((c) => c.status === status);
  }

  completeCampaign(campaign: CampaignDTO): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.error("Admin not found");
      return;
    }

    if (!confirm(`Mark campaign "${campaign.title}" as COMPLETED?`)) return;

    this.campaignService
      .updateCampaignStatus(
        user.userId,
        campaign.campaignId,
        CampaignStatus.COMPLETED
      )
      .subscribe({
        next: () => {
          this.toastService.success("Campaign marked as completed!");
          this.loadCampaigns(); // Refresh the campaigns list
        },
        error: () => {
          this.toastService.error("Failed to complete campaign");
        },
      });
  }
  // Inside campaign-detail.component.ts, add:

  stopCampaign(campaign: CampaignDTO): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.error("Admin not found");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to stop campaign "${campaign.title}"? This will set it as INACTIVE.`
      )
    )
      return;

    this.stopCampaignLoading.set(true);

    this.campaignService
      .updateCampaignStatus(
        user.userId,
        campaign.campaignId,
        CampaignStatus.INACTIVE
      )
      .subscribe({
        next: () => {
          this.toastService.success(
            "Campaign has been stopped (set as INACTIVE)."
          );
          this.loadCampaigns(); // Refresh the dashboard after status change
          this.stopCampaignLoading.set(false);
        },
        error: (err) => {
          this.toastService.error(
            "Failed to stop campaign.",
            err.error?.message || "Unknown error"
          );
          this.stopCampaignLoading.set(false);
        },
      });
  }
  // Additional signals for stop campaign modal
  showStopConfirmModal = signal(false);
  campaignToStop = signal<CampaignDTO | null>(null);

  openStopModal(campaign: CampaignDTO) {
    this.campaignToStop.set(campaign);
    this.showStopConfirmModal.set(true);
  }

  confirmStopCampaign(): void {
    const campaign = this.campaignToStop();
    const user = this.authService.currentUser();
    if (!user || !campaign) {
      this.showStopConfirmModal.set(false);
      return;
    }

    this.stopCampaignLoading.set(true);

    this.campaignService
      .updateCampaignStatus(
        user.userId,
        campaign.campaignId,
        CampaignStatus.INACTIVE
      )
      .subscribe({
        next: () => {
          this.toastService.success(
            "Campaign has been stopped (set as INACTIVE)."
          );
          this.showStopConfirmModal.set(false);
          this.campaignToStop.set(null);
          this.stopCampaignLoading.set(false);
          this.loadCampaigns();
        },
        error: (err) => {
          this.toastService.error(
            "Failed to stop campaign.",
            err.error?.message || "Unknown error"
          );
          this.showStopConfirmModal.set(false);
          this.stopCampaignLoading.set(false);
        },
      });
  }
}
