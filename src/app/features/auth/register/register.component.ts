// src/app/features/auth/register/register.component.ts
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
    role: ["", Validators.required],
    profilePicture: this.fb.control<File | null>(null),
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.registerForm.patchValue({ profilePicture: input.files[0] });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.toastService.error("Please fill all required fields correctly.");
      return;
    }

    const formData = new FormData();

    const { name, email, password, role } = this.registerForm.value;

    const userObj = {
      name,
      email,
      password,
      role,
    };

    formData.append("user", JSON.stringify(userObj));

    if (this.registerForm.value.profilePicture) {
      formData.append("profilePicture", this.registerForm.value.profilePicture);
    }

    this.authService.registerWithFormData(formData).subscribe({
      next: (user) => {
        this.toastService.success("Registration successful!");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        this.toastService.error("Registration failed. " + err.error.message);
        console.error("Registration error:", err);
      },
    });
  }
}
