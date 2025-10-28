// src/app/features/impact-stories/story-list/story-list.component.ts
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ImpactStoryService } from "../../../core/services/impact-story.service";
import { ToastService } from "../../../core/services/toast.service";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-story-list",
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: "./story-list.component.html",
})
export class StoryListComponent implements OnInit {
  private storyService = inject(ImpactStoryService);
  private toastService = inject(ToastService);
  authService = inject(AuthService);

  stories = this.storyService.stories;
  loading = this.storyService.loading;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.loading.set(false);
      this.toastService.error(
        "No user logged in. Please login to view stories."
      );
      return;
    }

    if (user?.role.roleName === "DONOR") {
      this.storyService.getImpactStoriesByDonor(user.userId).subscribe({
        next: () => {
          // stories signal updated automatically
        },
        error: (err) => {
          this.toastService.error("Failed to load your campaign stories");
          this.loading.set(false);
          console.error("Error loading stories:", err);
        },
      });
    } else if (user?.role.roleName === "ADMIN") {
      this.storyService.getImpactStoriesByAdmin(user.userId).subscribe({
        next: () => {
          // stories signal updated automatically
        },
        error: (err) => {
          this.toastService.error("Failed to load admin stories");
          this.loading.set(false);
          console.error("Error loading admin stories:", err);
        },
      });
    } else {
      this.loading.set(false);
      this.toastService.error(
        "No donor or admin logged in. Please login to view stories."
      );
    }
  }
}
