import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

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
  lucideStar,
} from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthView, AuthModalService } from '../../../../core/services/auth-modal.service';
import { GoogleIdentityService } from '../../../../core/services/google-identity.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent],
  templateUrl: './register.html',
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideMail,
      lucideSmartphone,
      lucideLock,
      lucideEye,
      lucideEyeOff,
      lucideGauge,
      lucideShoppingBag,
      lucideStar,
    }),
  ],
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  readonly switchView = output<AuthView>();
  @ViewChild('googleButtonContainer') private googleButtonContainer?: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private googleIdentityService = inject(GoogleIdentityService);
  private router = inject(Router);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
      ],
    ],
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
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.registerForm.value;

    this.authService
      .register({
        email: email!,
        password: password!,
        agreeTerms: true,
        sendOffers: false,
      })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.authModalService.setPendingVerificationEmail(email!);
            this.switchView.emit('verify');
          } else {
            this.errorMessage.set(
              response.message || 'Registration failed. Please check your details.',
            );
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('An unexpected error occurred. Please try again.');
          console.error('Registration error', err);
        },
      });
  }

  private async renderGoogleButton(): Promise<void> {
    const container = this.googleButtonContainer?.nativeElement;
    if (!container) {
      return;
    }

    if (!this.googleIdentityService.isConfigured) {
      this.googleUnavailableMessage.set('Google sign-up is not configured for this store.');
      return;
    }

    try {
      await this.googleIdentityService.renderButton(
        container,
        (idToken) => this.onGoogleCredential(idToken),
        'continue_with',
      );
    } catch {
      this.googleUnavailableMessage.set('Google sign-up is unavailable right now.');
    }
  }

  private onGoogleCredential(idToken: string): void {
    this.isGoogleLoading.set(true);
    this.errorMessage.set(null);

    this.authService
      .googleLogin({
        idToken,
        agreeTerms: true,
        sendOffers: false,
      })
      .subscribe({
        next: (response) => {
          this.isGoogleLoading.set(false);
          if (response.success) {
            this.authModalService.close();
            return;
          }

          this.errorMessage.set(
            this.resolveGoogleErrorMessage(response.errorCode, response.message),
          );
        },
        error: () => {
          this.isGoogleLoading.set(false);
          this.errorMessage.set('Google sign-up failed. Please try again.');
        },
      });
  }

  private resolveGoogleErrorMessage(errorCode?: string, message?: string): string {
    switch (errorCode) {
      case 'customer_auth.google_not_configured':
        return 'Google sign-up is not configured yet.';
      case 'customer_auth.invalid_google_token':
        return 'Google sign-up could not be verified. Please try again.';
      case 'customer_auth.google_email_not_verified':
        return 'Your Google email must be verified before signing up.';
      case 'customer_auth.external_account_conflict':
        return 'This Google account is already linked to another customer.';
      case 'customer_auth.tenant_access_denied':
        return 'Google sign-up is not available for this store.';
      case 'customer_auth.terms_required':
        return 'You must agree to the terms before signing up with Google.';
      default:
        return message || 'Google sign-up failed. Please try again.';
    }
  }
}
