import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  lucideMail, 
  lucideLock, 
  lucideEye, 
  lucideEyeOff,
  lucidePackage,
  lucideMapPin,
  lucideStar
} from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthView, AuthModalService } from '../../../../core/services/auth-modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './login.html',
  viewProviders: [provideIcons({ 
    lucideMail, 
    lucideLock, 
    lucideEye, 
    lucideEyeOff,
    lucidePackage,
    lucideMapPin,
    lucideStar
  })]
})
export class LoginComponent {
  @Output() switchView = new EventEmitter<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email: email!, password: password!, rememberMe: rememberMe! })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.authModalService.close();
          } else {
            this.errorMessage = response.message || 'Login failed. Please check your credentials.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          console.error('Login error', err);
        }
      });
  }
}
