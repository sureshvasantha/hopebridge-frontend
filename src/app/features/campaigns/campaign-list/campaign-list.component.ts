// src/app/features/campaigns/campaign-list/campaign-list.component.ts
import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CampaignService } from "../../../core/services/campaign.service";
import { ToastService } from "../../../core/services/toast.service";
import { CampaignCardComponent } from "../campaign-card/campaign-card.component";
import { CampaignDTO, CampaignType } from "../../../core/models";

@Component({
  selector: "app-campaign-list",
  imports: [CommonModule, FormsModule, CampaignCardComponent],
  standalone: true,
  templateUrl: "./campaign-list.component.html",
})
export class CampaignListComponent implements OnInit {
  private campaignService = inject(CampaignService);
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
