import { Component, inject, output, signal } from '@angular/core';
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
  readonly switchView = output<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email: email!, password: password!, rememberMe: rememberMe! })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.authModalService.close();
            return;
          }

          if (response.errorCode === 'customer_auth.email_not_verified') {
            this.authModalService.setPendingVerificationEmail(email!);
            this.errorMessage.set(null);
            this.switchView.emit('verify');
            return;
          }

          this.errorMessage.set(response.message || 'Login failed. Please check your credentials.');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('An unexpected error occurred. Please try again.');
          console.error('Login error', err);
        }
      });
  }
}
