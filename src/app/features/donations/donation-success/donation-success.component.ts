// src/app/features/donations/donation-success/donation-success.component.ts
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { DonationService } from "../../../core/services/donation.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "app-donation-success",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "donation-success.component.html",
})
export class DonationSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private donationService = inject(DonationService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loading = true;
  success = false;
  error = "";

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get("session_id");
    const user = this.authService.currentUser();
    console.log("vars after stripe redirect: ", sessionId, user);

    if (sessionId && user) {
      this.donationService.confirmPayment(user.userId, sessionId).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.toastService.success("Your donation was confirmed!");
        },
        error: (err) => {
          this.loading = false;
          this.error =
            "Could not verify payment. Please contact support if this is an error.";
          this.toastService.error("Payment verification failed");
          console.error("Stripe confirm error:", err);
        },
      });
    } else {
      this.loading = false;
      this.error = "Invalid session or user. Please login and try again.";
      this.toastService.error(
        "Payment verification failed - missing user or session"
      );
    }
  }
}
