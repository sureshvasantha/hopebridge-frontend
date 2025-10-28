// src/app/features/auth/register/register.component.ts
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "app-register",
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  registerForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(4)]],
    role: ["DONOR", [Validators.required]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value as any).subscribe({
      next: (response) => {
        this.toastService.success("Registration successful!");
        const route =
          response.user.roles[0].roleName === "ADMIN"
            ? "/admin/dashboard"
            : "/campaigns";
        this.router.navigate([route]);
      },
      error: (error) => {
        this.toastService.error(
          "Registration failed. Email may already be in use."
        );
        console.error("Registration error:", error);
      },
    });
  }
}
