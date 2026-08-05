import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, output, signal } from '@angular/core';
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
import { GoogleIdentityService } from '../../../../core/services/google-identity.service';

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
export class LoginComponent implements AfterViewInit, OnDestroy {
  readonly switchView = output<AuthView>();
  @ViewChild('googleButtonContainer') private googleButtonContainer?: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private googleIdentityService = inject(GoogleIdentityService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  showPassword = signal(false);
  isLoading = signal(false);
  isGoogleLoading = signal(false);
  googleUnavailableMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngAfterViewInit(): void {
    void this.renderGoogleButton();
  }

  ngOnDestroy(): void {
    this.googleIdentityService.cancel();
  }

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

  private async renderGoogleButton(): Promise<void> {
    const container = this.googleButtonContainer?.nativeElement;
    if (!container) {
      return;
    }

    if (!this.googleIdentityService.isConfigured) {
      this.googleUnavailableMessage.set('Google sign-in is not configured for this store.');
      return;
    }

    try {
      await this.googleIdentityService.renderButton(
        container,
        (idToken) => this.onGoogleCredential(idToken),
        'continue_with'
      );
    } catch {
      this.googleUnavailableMessage.set('Google sign-in is unavailable right now.');
    }
  }

  private onGoogleCredential(idToken: string): void {
    this.isGoogleLoading.set(true);
    this.errorMessage.set(null);

    const rememberMe = this.loginForm.controls.rememberMe.value === true;
    this.authService.googleLogin({ idToken, rememberMe })
      .subscribe({
        next: (response) => {
          this.isGoogleLoading.set(false);
          if (response.success) {
            this.authModalService.close();
            return;
          }

          if (response.errorCode === 'customer_auth.terms_required') {
            this.errorMessage.set('Please create an account and accept the terms before using Google sign-in.');
            this.switchView.emit('register');
            return;
          }

          this.errorMessage.set(this.resolveGoogleErrorMessage(response.errorCode, response.message));
        },
        error: () => {
          this.isGoogleLoading.set(false);
          this.errorMessage.set('Google sign-in failed. Please try again.');
        }
      });
  }

  private resolveGoogleErrorMessage(errorCode?: string, message?: string): string {
    switch (errorCode) {
      case 'customer_auth.google_not_configured':
        return 'Google sign-in is not configured yet.';
      case 'customer_auth.invalid_google_token':
        return 'Google sign-in could not be verified. Please try again.';
      case 'customer_auth.google_email_not_verified':
        return 'Your Google email must be verified before signing in.';
      case 'customer_auth.external_account_conflict':
        return 'This Google account is already linked to another customer.';
      case 'customer_auth.tenant_access_denied':
        return 'Google sign-in is not available for this store.';
      default:
        return message || 'Google sign-in failed. Please try again.';
    }
  }
}
