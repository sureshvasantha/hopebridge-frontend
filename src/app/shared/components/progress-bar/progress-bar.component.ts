// src/app/shared/components/progress-bar/progress-bar.component.ts
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent {
  current = input.required<number>();
  goal = input.required<number>();

  percentage = computed(() => {
    const pct = (this.current() / this.goal()) * 100;
    return Math.min(Math.max(pct, 0), 100);
  });

  percentageText = computed(() => {
    return this.percentage().toFixed(1);
  });
}
