// src/app/features/impact-stories/story-detail/story-detail.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ImpactStoryService } from '../../../core/services/impact-story.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-story-detail',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './story-detail.component.html'
})
export class StoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private storyService = inject(ImpactStoryService);
  private toastService = inject(ToastService);

  story = this.storyService.selectedStory;
  loading = this.storyService.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.storyService.getStoryById(+id).subscribe({
        error: (error) => {
          this.toastService.error('Failed to load story');
          console.error('Error:', error);
        }
      });
    }
  }
}
