// src/app/core/services/impact-story.service.ts
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";
import { ImpactStoryDTO, CreateImpactStoryRequest } from "../models";

@Injectable({
  providedIn: "root",
})
export class ImpactStoryService {
  private apiService = inject(ApiService);
  stories = signal<ImpactStoryDTO[]>([]);
  selectedStory = signal<ImpactStoryDTO | null>(null);
  loading = signal<boolean>(false);

  getStoryById(storyId: number): Observable<ImpactStoryDTO> {
    this.loading.set(true);
    return this.apiService
      .get<ImpactStoryDTO>(`/public/impact-stories/${storyId}`)
      .pipe(
        tap((story) => {
          this.selectedStory.set(story);
          this.loading.set(false);
        })
      );
  }

  getStoriesByCampaign(campaignId: number): Observable<ImpactStoryDTO[]> {
    this.loading.set(true);
    return this.apiService
      .get<ImpactStoryDTO[]>(`/public/campaigns/${campaignId}/impact-stories`)
      .pipe(
        tap((stories) => {
          this.stories.set(stories);
          this.loading.set(false);
        })
      );
  }

  getImpactStoriesByDonor(donorId: number): Observable<ImpactStoryDTO[]> {
    this.loading.set(true);
    return this.apiService
      .get<ImpactStoryDTO[]>(`/donors/${donorId}/impact-stories`)
      .pipe(
        tap((stories) => {
          this.stories.set(stories);
          this.loading.set(false);
        })
      );
  }

  /** ✅ Admin: View all impact stories created by this admin */
  getImpactStoriesByAdmin(adminId: number): Observable<ImpactStoryDTO[]> {
    this.loading.set(true);
    return this.apiService
      .get<ImpactStoryDTO[]>(`/admins/${adminId}/impact-stories`)
      .pipe(
        tap((stories) => {
          this.stories.set(stories);
          this.loading.set(false);
        })
      );
  }

  /** ✅ Admin: View stories by campaign (for that admin) */
  getImpactStoriesByCampaignForAdmin(
    adminId: number,
    campaignId: number
  ): Observable<ImpactStoryDTO[]> {
    this.loading.set(true);
    return this.apiService
      .get<ImpactStoryDTO[]>(
        `/admins/${adminId}/impact-stories/campaign/${campaignId}`
      )
      .pipe(
        tap((stories) => {
          this.stories.set(stories);
          this.loading.set(false);
        })
      );
  }
  // Admin endpoints
  createImpactStory(
    adminId: number,
    campaignId: number,
    story: CreateImpactStoryRequest
  ): Observable<ImpactStoryDTO> {
    const formData = new FormData();
    formData.append(
      "story",
      new Blob(
        [
          JSON.stringify({
            title: story.title,
            content: story.content,
            campaignId: story.campaignId,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (story.images && story.images.length > 0) {
      story.images.forEach((image) => formData.append("images", image));
    }

    return this.apiService.postFormData<ImpactStoryDTO>(
      `/admins/${adminId}/impact-stories/campaign/${campaignId}`,
      formData
    );
  }
}
