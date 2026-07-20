import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUser, lucideMail, lucidePhone, lucideSave, lucideArrowLeft, lucideLoader2 } from '@ng-icons/lucide';
import { CustomerProfileService } from '../../../../../core/services/customer-profile.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgIconComponent],
  templateUrl: './profile.html',
  viewProviders: [provideIcons({ 
    lucideUser, 
    lucideMail, 
    lucidePhone, 
    lucideSave,
    lucideArrowLeft,
    lucideLoader2
  })]
})
export class PersonalInformation implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(CustomerProfileService);
  private toastService = inject(ToastService);

  profileForm: FormGroup;
  isLoading = signal(true);
  isSaving = signal(false);

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(75)]],
      lastName: ['', [Validators.maxLength(75)]],
      email: ['', [Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.profileService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileForm.patchValue({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone
          });
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to load profile');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Profile updated successfully');
        }
        this.isSaving.set(false);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to update profile');
        this.isSaving.set(false);
      }
    });
  }
}
