// src/app/features/campaigns/campaign-card/campaign-card.component.ts
import { Component, input, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CampaignDTO } from "../../../core/models";
import { ProgressBarComponent } from "../../../shared/components/progress-bar/progress-bar.component";

@Component({
  selector: "app-campaign-card",
  imports: [CommonModule, RouterLink, ProgressBarComponent],
  standalone: true,
  templateUrl: "./campaign-card.component.html",
})
export class CampaignCardComponent {
  campaign = input.required<CampaignDTO>();

  mainImage = computed(() => {
    const images = this.campaign().images;
    return images && images.length > 0
      ? images[0].imageUrl
      : "https://placehold.co/400x300?text=No+Image";
  });

  daysLeft = computed(() => {
    const endDate = new Date(this.campaign().endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  });
}
