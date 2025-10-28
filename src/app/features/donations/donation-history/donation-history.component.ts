// src/app/features/donations/donation-history/donation-history.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonationService } from '../../../core/services/donation.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-donation-history',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './donation-history.component.html'
})
export class DonationHistoryComponent implements OnInit {
  private donationService = inject(DonationService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  donations = this.donationService.donations;
  loading = this.donationService.loading;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.donationService.getMyDonations(user.userId).subscribe({
        error: (error) => {
          this.toastService.error('Failed to load donations');
          console.error('Error loading donations:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
