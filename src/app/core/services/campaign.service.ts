// src/app/core/services/campaign.service.ts
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiService } from "./api.service";
import {
  CampaignDTO,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignStatus,
  DonationDTO,
} from "../models";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CampaignService {
  private apiService = inject(ApiService);
  campaigns = signal<CampaignDTO[]>([]);
  donations = signal<DonationDTO[]>([]);
  selectedCampaign = signal<CampaignDTO | null>(null);
  loading = signal<boolean>(false);

  // Public endpoints
  getAllCampaigns(
    keyword?: string,
    type?: string,
    location?: string
  ): Observable<CampaignDTO[]> {
    this.loading.set(true);
    let params = new HttpParams();
    if (keyword) params = params.set("keyword", keyword);
    if (type) params = params.set("type", type);
    if (location) params = params.set("location", location);

    return this.apiService.get<CampaignDTO[]>("/public/campaigns", params).pipe(
      tap((campaigns) => {
        this.campaigns.set(campaigns);
        this.loading.set(false);
      })
    );
  }

  getCampaignById(id: number): Observable<CampaignDTO> {
    this.loading.set(true);
    return this.apiService.get<CampaignDTO>(`/public/campaigns/${id}`).pipe(
      tap((campaign) => {
        this.selectedCampaign.set(campaign);
        this.loading.set(false);
      })
    );
  }

  getCampaignsByType(type: string): Observable<CampaignDTO[]> {
    return this.apiService.get<CampaignDTO[]>(`/public/campaigns/type/${type}`);
  }

  getCampaignsByLocation(location: string): Observable<CampaignDTO[]> {
    return this.apiService.get<CampaignDTO[]>(
      `/public/campaigns/location/${location}`
    );
  }

  // Admin endpoints
  getCampaignsByAdmin(adminId: number): Observable<CampaignDTO[]> {
    return this.apiService
      .get<CampaignDTO[]>(`/admins/${adminId}/campaigns`)
      .pipe(tap((campaigns) => this.campaigns.set(campaigns)));
  }

  getCampaignByAdminAndId(
    adminId: number,
    campaignId: number
  ): Observable<CampaignDTO> {
    return this.apiService
      .get<CampaignDTO>(`/admins/${adminId}/campaigns/${campaignId}`)
      .pipe(tap((campaign) => this.selectedCampaign.set(campaign)));
  }
  getDonationsByCampaign(
    adminId: number,
    campaignId: number
  ): Observable<DonationDTO[]> {
    this.loading.set(true);
    return this.apiService
      .get<DonationDTO[]>(
        `/admins/${adminId}/campaigns/${campaignId}/donations`
      )
      .pipe(
        tap((donations) => {
          this.donations.set(donations);
          this.loading.set(false);
        })
      );
  }

  createCampaign(
    adminId: number,
    campaign: CreateCampaignRequest,
    images?: File[]
  ): Observable<CampaignDTO> {
    const formData = new FormData();
    formData.append(
      "campaign",
      new Blob([JSON.stringify(campaign)], { type: "application/json" })
    );

    if (images && images.length > 0) {
      images.forEach((image) => formData.append("images", image));
    }

    return this.apiService.postFormData<CampaignDTO>(
      `/admins/${adminId}/campaigns`,
      formData
    );
  }

  updateCampaign(
    adminId: number,
    campaignId: number,
    campaign: UpdateCampaignRequest,
    images?: File[]
  ): Observable<CampaignDTO> {
    const formData = new FormData();

    formData.append("campaignJson", JSON.stringify(campaign));

    if (images && images.length > 0) {
      images.forEach((file) => formData.append("imageFiles", file));
    }

    return this.apiService.putFormData<CampaignDTO>(
      `/admins/${adminId}/campaigns/${campaignId}`,
      formData
    );
  }

  updateCampaignStatus(
    adminId: number,
    campaignId: number,
    status: CampaignStatus
  ): Observable<CampaignDTO> {
    return this.apiService.patch<CampaignDTO>(
      `/admins/${adminId}/campaigns/${campaignId}/status?status=${status}`
    );
  }
}
