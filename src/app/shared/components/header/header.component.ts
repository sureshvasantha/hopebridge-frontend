// src/app/shared/components/header/header.component.ts
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  authService = inject(AuthService);

  user = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  isAdmin = this.authService.isAdmin;
  isDonor = this.authService.isDonor;

  logout(): void {
    this.authService.logout();
  }
}
