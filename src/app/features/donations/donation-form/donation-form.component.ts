// src/app/features/donations/donation-form/donation-form.component.ts
import { Component, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DonationService } from "../../../core/services/donation.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "app-donation-form",
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: "./donation-form.component.html",
})
export class DonationFormComponent {
  private fb = inject(FormBuilder);
  private donationService = inject(DonationService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  

  campaignId = input.required<number>();

  donationForm = this.fb.group({
    amount: ["", [Validators.required, Validators.min(50)]],
    currency: ["INR"],
  });

  submitDonation(): void {
    if (this.donationForm.invalid) {
      this.toastService.error(
        "Please enter a valid amount. Minimum is Rs.50 or 50 cents."
      );
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.error("Please login to donate");

      return;
    }

    const request = {
      campaignId: this.campaignId(),
      donorId: user.userId,
      amount: +this.donationForm.value.amount!,
      currency: this.donationForm.value.currency || "INR",
    };

    this.donationService.createCheckoutSession(user.userId, request).subscribe({
      next: (response) => {
        this.toastService.success("Redirecting to payment...");
        window.location.href = response.sessionUrl;
      },
      error: (error) => {
        this.toastService.error("Failed to initiate payment");
        console.error("Donation error:", error);
      },
    });
  }
}
