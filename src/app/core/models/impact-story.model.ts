// src/app/core/models/impact-story.model.ts
export interface ImpactImageDTO {
  imageId: number;
  imageUrl: string;
  storyId: number;
}

export interface ImpactStoryDTO {
  storyId: number;
  title: string;
  content: string;
  postedDate: string;
  campaignId: number;
  images: ImpactImageDTO[];
}

export interface CreateImpactStoryRequest {
  title: string;
  content: string;
  campaignId: number;
  images?: File[];
}
