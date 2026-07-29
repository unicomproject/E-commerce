import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  lucideUser,
  lucideMail, 
  lucideSmartphone,
  lucideLock, 
  lucideEye, 
  lucideEyeOff,
  lucideGauge,
  lucideShoppingBag,
  lucideStar
} from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthView, AuthModalService } from '../../../../core/services/auth-modal.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './register.html',
  viewProviders: [provideIcons({ 
    lucideUser,
    lucideMail, 
    lucideSmartphone,
    lucideLock, 
    lucideEye, 
    lucideEyeOff,
    lucideGauge,
    lucideShoppingBag,
    lucideStar
  })]
})
export class RegisterComponent {
  readonly switchView = output<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private router = inject(Router);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    ]],
    agreeTerms: [false, Validators.requiredTrue],
    sendOffers: [false]
  });

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, password, agreeTerms, sendOffers } = this.registerForm.value;

    this.authService.register({ 
      email: email!, 
      password: password!, 
      agreeTerms: agreeTerms!, 
      sendOffers: sendOffers! 
    }).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.authModalService.setPendingVerificationEmail(email!);
            this.switchView.emit('verify');
          } else {
            this.errorMessage.set(response.message || 'Registration failed. Please check your details.');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('An unexpected error occurred. Please try again.');
          console.error('Registration error', err);
        }
      });
  }
}
