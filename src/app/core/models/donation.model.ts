// src/app/core/models/donation.model.ts
export type DonationStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface DonationDTO {
  donationId: number;
  amount: number;
  status: DonationStatus;
  currency: string;
  receiptUrl: string;
  donationDate: string;
  donorId: number;
  campaignId: number;
}

export interface StripeCheckoutRequest {
  campaignId: number;
  donorId: number;
  amount: number;
  currency: string;
}

export interface StripeResponse {
  status: string;
  message: string;
  sessionId: string;
  sessionUrl: string;
}
