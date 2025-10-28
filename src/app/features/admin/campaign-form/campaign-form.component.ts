// src/app/features/admin/campaign-form/campaign-form.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../core/services/campaign.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CampaignType } from '../../../core/models';

@Component({
  selector: 'app-campaign-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './campaign-form.component.html'
})
export class CampaignFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  selectedImages = signal<File[]>([]);
  campaignTypes = Object.values(CampaignType);


  campaignForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    goalAmount: [0, [Validators.required, Validators.min(1000)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    campaignType: ['' as CampaignType, Validators.required],
    location: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      // Load campaign for editing
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages.set(Array.from(input.files));
    }
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) {
      this.toastService.error('Please fill all required fields correctly');
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    const formValue = this.campaignForm.value;
    const request = {
      title: formValue.title!,
      description: formValue.description!,
      goalAmount: +formValue.goalAmount!,
      startDate: formValue.startDate!,
      endDate: formValue.endDate!,
      campaignType: formValue.campaignType!,
      location: formValue.location!
    };

    this.campaignService.createCampaign(user.userId, request, this.selectedImages()).subscribe({
      next: () => {
        this.toastService.success('Campaign created successfully!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.toastService.error('Failed to create campaign');
        console.error('Error:', error);
      }
    });
  }
}
