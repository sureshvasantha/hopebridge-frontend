// src/app/features/donations/donation-history/donation-history.component.ts
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { DonationService } from "../../../core/services/donation.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { switchMap, finalize } from "rxjs/operators";
import { DonationDTO } from "../../../core/models";

@Component({
  selector: "app-donation-history",
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: "./donation-history.component.html",
})
export class DonationHistoryComponent implements OnInit {
  private donationService = inject(DonationService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  donations = this.donationService.donations;
  loading = this.donationService.loading;
  confirmingSessionId = ""; // track currently confirming payment sessionId

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.donationService.getMyDonations(user.userId).subscribe({
        error: (error) => {
          this.toastService.error("Failed to load donations");
          console.error("Error loading donations:", error);
        },
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  confirmPendingPayment(donation: DonationDTO): void {
    if (!donation.paymentSessionId) {
      this.toastService.error("No payment session found for this donation.");
      return;
    }

    // Avoid concurrent confirm calls for the same donation
    if (this.confirmingSessionId === donation.paymentSessionId) {
      return;
    }

    this.confirmingSessionId = donation.paymentSessionId;

    this.donationService
      .confirmPayment(donation.donorId, donation.paymentSessionId)
      .pipe(finalize(() => (this.confirmingSessionId = "")))
      .subscribe({
        next: (updatedDonation) => {
          this.toastService.success("Payment confirmed successfully!");
          this.donationService.getMyDonations(donation.donorId).subscribe({
            error: (err) => {
              this.toastService.error(
                "Failed to refresh donations after confirmation."
              );
              console.error(err);
            },
          });
        },
        error: (error) => {
          this.toastService.error(
            "Failed to confirm payment. Please try again."
          );
          console.error("Payment confirmation error:", error);
        },
      });
  }
}
