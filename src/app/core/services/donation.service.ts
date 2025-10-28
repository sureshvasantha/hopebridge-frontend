// src/app/core/services/donation.service.ts
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";
import { DonationDTO, StripeCheckoutRequest, StripeResponse } from "../models";

@Injectable({
  providedIn: "root",
})
export class DonationService {
  private apiService = inject(ApiService);
  donations = signal<DonationDTO[]>([]);
  loading = signal<boolean>(false);

  createCheckoutSession(
    donorId: number,
    request: StripeCheckoutRequest
  ): Observable<StripeResponse> {
    return this.apiService.post<StripeResponse>(
      `/donors/${donorId}/donations/checkout`,
      request
    );
  }

  getMyDonations(donorId: number): Observable<DonationDTO[]> {
    this.loading.set(true);
    return this.apiService
      .get<DonationDTO[]>(`/donors/${donorId}/donations`)
      .pipe(
        tap((donations) => {
          this.donations.set(donations);
          this.loading.set(false);
        })
      );
  }

  confirmPayment(donorId: number, sessionId: string): Observable<DonationDTO> {
    return this.apiService.get<DonationDTO>(
      `/donors/${donorId}/donations/confirm?session_id=${sessionId}`
    );
  }

  getDonationsByCampaign(
    adminId: number,
    campaignId: number
  ): Observable<DonationDTO[]> {
    return this.apiService.get<DonationDTO[]>(
      `/admins/${adminId}/campaigns/${campaignId}/donations`
    );
  }
}
