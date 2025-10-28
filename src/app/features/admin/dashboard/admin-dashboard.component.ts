// src/app/features/admin/dashboard/admin-dashboard.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CampaignService } from '../../../core/services/campaign.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CampaignDTO } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  campaigns = this.campaignService.campaigns;
  loading = this.campaignService.loading;
  showCreateForm = signal(false);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.campaignService.getCampaignsByAdmin(user.userId).subscribe({
        error: (error) => {
          this.toastService.error('Failed to load campaigns');
          console.error('Error loading campaigns:', error);
        }
      });
    }
  }

  getCampaignsByStatus(status: string): CampaignDTO[] {
    return this.campaigns().filter(c => c.status === status);
  }
}
