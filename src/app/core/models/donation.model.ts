// src/app/core/models/donation.model.ts
export type DonationStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface DonationDTO {
  donationId: number;
  amount: number;
  status: DonationStatus;
  currency: string;
  displayAmount: number;
  displayCurrency: string;
  receiptUrl: string;
  donationDate: string;
  donorId: number;
  donorName: string;
  campaignId: number;
  paymentSessionId: string;
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
