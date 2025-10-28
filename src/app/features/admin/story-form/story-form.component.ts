// src/app/features/admin/story-form/story-form.component.ts
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ImpactStoryService } from "../../../core/services/impact-story.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "app-story-form",
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: "./story-form.component.html",
})
export class StoryFormComponent {
  private fb = inject(FormBuilder);
  private storyService = inject(ImpactStoryService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  storyForm = this.fb.group({
    title: ["", [Validators.required]],
    content: ["", [Validators.required, Validators.minLength(800)]],
    campaignId: [0, [Validators.required, Validators.min(1)]],
  });

  onSubmit(): void {
    if (this.storyForm.invalid) return;

    const user = this.authService.currentUser();
    if (!user) return;

    const formValue = this.storyForm.value;
    const request = {
      title: formValue.title!,
      content: formValue.content!,
      campaignId: +formValue.campaignId!,
    };

    this.storyService
      .createImpactStory(user.userId, request.campaignId, request)
      .subscribe({
        next: () => {
          this.toastService.success("Impact story published!");
          this.router.navigate(["/admin/dashboard"]);
        },
        error: (error) => {
          this.toastService.error("Failed to publish story");
          console.error("Error:", error);
        },
      });
  }
}
