// src/app/features/campaigns/campaign-list/campaign-list.component.ts
import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CampaignService } from "../../../core/services/campaign.service";
import { ToastService } from "../../../core/services/toast.service";
import { CampaignCardComponent } from "../campaign-card/campaign-card.component";
import { CampaignDTO, CampaignType } from "../../../core/models";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-campaign-list",
  imports: [CommonModule, FormsModule, CampaignCardComponent],
  standalone: true,
  templateUrl: "./campaign-list.component.html",
})
export class CampaignListComponent implements OnInit {
  private campaignService = inject(CampaignService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  campaigns = this.campaignService.campaigns;
  loading = this.campaignService.loading;

  searchKeyword = signal("");
  selectedType = signal<string>("");
  selectedLocation = signal("");

  campaignTypes = Object.values(CampaignType);

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    const user = this.authService.currentUser();
    if (user && user.role.roleName === "ADMIN") {
      this.campaignService.getCampaignsByAdmin(user.userId).subscribe({
        next: () => {
          console.log("Admin campaigns loaded successfully");
        },
        error: (error) => {
          this.toastService.error("Failed to load admin campaigns");
          console.error("Error loading admin campaigns:", error);
        },
      });
    } else {
      // Load all campaigns with applied filters for normal user
      this.campaignService
        .getAllCampaigns(
          this.searchKeyword() || undefined,
          this.selectedType() || undefined,
          this.selectedLocation() || undefined
        )
        .subscribe({
          next: () => {
            console.log("Campaigns loaded successfully");
          },
          error: (error) => {
            this.toastService.error("Failed to load campaigns");
            console.error("Error loading campaigns:", error);
          },
        });
    }
  }

  onSearch(): void {
    this.loadCampaigns();
  }

  onFilterChange(): void {
    this.loadCampaigns();
  }

  clearFilters(): void {
    this.searchKeyword.set("");
    this.selectedType.set("");
    this.selectedLocation.set("");
    this.loadCampaigns();
  }
}
