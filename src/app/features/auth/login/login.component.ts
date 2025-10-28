// src/app/features/auth/login/login.component.ts
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { LoginRequest } from "../../../core/models";

@Component({
  selector: "app-login",
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loginForm = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(4)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    const payload: LoginRequest = {
      name: username ?? "",
      password: password ?? "",
    };
    this.authService.login(payload).subscribe({
      next: (response) => {
        this.toastService.success(`Welcome back, ${response.user.name}!`);
        const route =
          response.user.roles[0].roleName === "ADMIN"
            ? "/admin/dashboard"
            : "/campaigns";
        this.router.navigate([route]);
      },
      error: (error) => {
        this.toastService.error("Invalid credentials");
        console.error("Login error:", error);
      },
    });
  }
}
