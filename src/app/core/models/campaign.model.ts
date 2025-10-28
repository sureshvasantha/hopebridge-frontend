// src/app/core/models/campaign.model.ts
import { ImpactStoryDTO } from "./impact-story.model";

export enum CampaignStatus {
  COMPLETED = 'COMPLETED', // goal reached
  INACTIVE = 'INACTIVE',   // manually stopped
  ACTIVE = 'ACTIVE'
}

// Matches backend CampaignType enum
export enum CampaignType {
  MEDICAL = 'MEDICAL',
  EDUCATION = 'EDUCATION',
  CHILDREN = 'CHILDREN',
  ENVIRONMENT = 'ENVIRONMENT',
  WOMEN_EMPOWERMENT = 'WOMEN_EMPOWERMENT',
  ANIMAL_WELFARE = 'ANIMAL_WELFARE'
}

export interface CampaignImageDTO {
  imageId: number;
  imageUrl: string;
  description: string;
  campaignId: number;
}


export interface CampaignDTO {
  campaignId: number;
  title: string;
  description: string;
  goalAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  campaignType: CampaignType;
  location: string;
  createdBy: number;
  images: CampaignImageDTO[];
  stories: ImpactStoryDTO[];
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  goalAmount: number;
  startDate: string;
  endDate: string;
  campaignType: CampaignType;
  location: string;
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  goalAmount?: number;
  startDate?: string;
  endDate?: string;
  location?: string;
}
