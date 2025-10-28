// src/app/features/impact-stories/story-list/story-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImpactStoryService } from '../../../core/services/impact-story.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-story-list',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './story-list.component.html'
})
export class StoryListComponent implements OnInit {
  private storyService = inject(ImpactStoryService);
  private toastService = inject(ToastService);

  stories = this.storyService.stories;
  loading = this.storyService.loading;

  ngOnInit(): void {
    // Load stories - in real app, fetch from public endpoint
  }
}
