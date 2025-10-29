import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";
import { DonationService } from "../../../core/services/donation.service";
import { signal } from "@angular/core";

@Component({
  selector: "app-my-profile",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "my-profile.component.html",
})
export class MyProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private donationService = inject(DonationService);

  user = this.authService.currentUser();
  donationCount = signal(0);

  ngOnInit(): void {
    const user = this.user;
    if (user && user.userId) {
      // This assumes getMyDonations returns an observable of the user's donation list
      this.donationService.getMyDonations(user.userId).subscribe({
        next: (donations) => this.donationCount.set(donations.length),
        error: () => this.donationCount.set(0),
      });
    }
  }
}
