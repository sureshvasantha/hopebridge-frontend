// src/app/core/services/auth.service.ts
import { Injectable, inject, signal, computed } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { ApiService } from "./api.service";
import {
  UserDTO,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  currentUser = signal<UserDTO | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role.roleName === "ADMIN");
  isDonor = computed(() => this.currentUser()?.role.roleName === "DONOR");

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem("currentUser");
    const token = localStorage.getItem("authToken");
    if (userStr && token) {
      this.currentUser.set(JSON.parse(userStr));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>("/users/login", credentials).pipe(
      tap((response) => {
        const mappedUser: UserDTO = {
          ...response.user,
          role: {
            roleId: response.user.roles[0].roleId,
            roleName: response.user.roles[0].roleName,
          },
        };
        this.currentUser.set(mappedUser);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("currentUser", JSON.stringify(mappedUser));
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>("/users/register", request).pipe(
      tap((response) => {
        const mappedUser: UserDTO = {
          ...response.user,
          role: {
            roleId: response.user.roles[0].roleId,
            roleName: response.user.roles[0].roleName,
          },
        };
        this.currentUser.set(mappedUser);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("currentUser", JSON.stringify(mappedUser));
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    this.router.navigate(["/login"]);
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return new Observable((observer) => observer.next(false));
    return this.apiService.post<boolean>("/validate", { token });
  }
}
