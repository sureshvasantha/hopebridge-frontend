// src/app/shared/components/toast/toast.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './toast.component.html'
})
export class ToastComponent {
  toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  remove(id: number): void {
    this.toastService.remove(id);
  }

  getToastClass(type: string): string {
    const baseClasses = 'p-4 rounded-lg shadow-lg text-white';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500`;
      case 'error':
        return `${baseClasses} bg-red-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-500`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-500`;
    }
  }
}
