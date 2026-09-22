import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  inject,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';

import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideMail,
  lucideLock,
  lucideKeyRound,
  lucideArrowLeft,
  lucidePhone,
  lucideArrowRight
} from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthView, AuthModalService } from '../../../../core/services/auth-modal.service';
import { GoogleIdentityService } from '../../../../core/services/google-identity.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent],
  templateUrl: './login.component.html',
  viewProviders: [
    provideIcons({
      lucideMail,
      lucideLock,
      lucideKeyRound,
      lucideArrowLeft,
      lucidePhone,
      lucideArrowRight
    }),
  ],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  readonly switchView = output<AuthView>();
  @ViewChild('googleButtonContainer') private googleButtonContainer?: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private googleIdentityService = inject(GoogleIdentityService);
  private router = inject(Router);

  isOtpStep = signal(false);
  isLoading = signal(false);
  isGoogleLoading = signal(false);
  googleUnavailableMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  activeTab = signal<'email' | 'phone'>('email');
  shakeTerms = signal(false);
  
  otpDigits = signal<string[]>(['', '', '', '']);
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: [''],
    rememberMe: [false],
    agreeTerms: [false],
  });

  ngAfterViewInit(): void {
    void this.renderGoogleButton();
  }

  ngOnDestroy(): void {
    this.googleIdentityService.cancel();
  }

  goBack() {
    this.isOtpStep.set(false);
    this.errorMessage.set(null);
    this.authForm.patchValue({ code: '' });
    this.otpDigits.set(['', '', '', '']);
  }

  onSubmit() {
    if (!this.isOtpStep()) {
      this.requestOtp();
    } else {
      this.verifyOtp();
    }
  }

  private requestOtp() {
    const emailControl = this.authForm.get('email');
    if (emailControl?.invalid) {
      emailControl.markAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const email = this.authForm.value.email!;

    this.authService.requestOtp(email).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.isOtpStep.set(true);
        } else {
          this.errorMessage.set(response.message || 'Could not send OTP.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to send OTP. Please try again.');
        console.error('Request OTP error', err);
      },
    });
  }

  private verifyOtp() {
    const codeControl = this.authForm.get('code');
    if (!codeControl?.value) {
      this.errorMessage.set('Please enter the verification code.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, code, rememberMe } = this.authForm.value;

    this.authService.verifyOtp(email!, code!, rememberMe!).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.authModalService.close();
        } else {
          this.errorMessage.set(response.message || 'Invalid verification code.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Verification failed. Please try again.');
        console.error('Verify OTP error', err);
      },
    });
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Allow only numbers
    if (value && !/^\d$/.test(value)) {
      input.value = this.otpDigits()[index]; // Revert to old
      return;
    }

    const currentDigits = [...this.otpDigits()];
    currentDigits[index] = value;
    this.otpDigits.set(currentDigits);
    this.updateCodeControl();

    // Move to next input
    if (value && index < 3) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const currentDigits = [...this.otpDigits()];
      
      if (!currentDigits[index] && index > 0) {
        // If current is empty, move focus to prev and clear it
        this.otpInputs.toArray()[index - 1].nativeElement.focus();
        currentDigits[index - 1] = '';
      } else {
        // Clear current
        currentDigits[index] = '';
      }
      
      this.otpDigits.set(currentDigits);
      this.updateCodeControl();
      event.preventDefault(); // Prevent default backspace
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && index < 3) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
      event.preventDefault();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (!pastedData) return;
    
    const numbers = pastedData.replace(/\D/g, '').split('').slice(0, 4);
    const currentDigits = [...this.otpDigits()];
    
    for (let i = 0; i < numbers.length; i++) {
      currentDigits[i] = numbers[i];
    }
    
    this.otpDigits.set(currentDigits);
    this.updateCodeControl();
    
    if (numbers.length > 0) {
      const focusIndex = Math.min(numbers.length, 5);
      if (focusIndex < 6) {
        this.otpInputs.toArray()[focusIndex].nativeElement.focus();
      } else {
        this.otpInputs.toArray()[5].nativeElement.focus();
      }
    }
  }

  private updateCodeControl() {
    this.authForm.patchValue({ code: this.otpDigits().join('') });
  }

  private async renderGoogleButton(): Promise<void> {
    const container = this.googleButtonContainer?.nativeElement;
    if (!container) return;

    if (!this.googleIdentityService.isConfigured) {
      this.googleUnavailableMessage.set('Google sign-in is not configured for this store.');
      return;
    }

    try {
      await this.googleIdentityService.renderButton(
        container,
        (idToken) => this.onGoogleCredential(idToken),
        'continue_with',
      );
    } catch {
      this.googleUnavailableMessage.set('Google sign-in is unavailable right now.');
    }
  }

  /** Invoked by the overlay that blocks the Google button until terms are
   *  agreed to, so this fires on the customer's first click instead of only
   *  after they've already completed the Google flow. */
  onGoogleBlockedByTerms(): void {
    this.errorMessage.set('You must agree to the terms and privacy policy.');
    this.triggerTermsShake();
  }

  private onGoogleCredential(idToken: string): void {
    if (this.authForm.controls.agreeTerms.value !== true) {
      this.errorMessage.set('You must agree to the terms and privacy policy.');
      this.triggerTermsShake();
      return;
    }

    this.isGoogleLoading.set(true);
    this.errorMessage.set(null);

    const rememberMe = this.authForm.controls.rememberMe.value === true;
    const agreeTerms = this.authForm.controls.agreeTerms.value === true;
    this.authService.googleLogin({ idToken, rememberMe, agreeTerms }).pipe(
      timeout(30000)
    ).subscribe({
      next: (response) => {
        this.isGoogleLoading.set(false);
        if (response.success) {
          this.authModalService.close();
        } else {
          this.errorMessage.set(this.resolveGoogleErrorMessage(response.errorCode, response.message));
        }
      },
      error: (err) => {
        this.isGoogleLoading.set(false);
        if (err instanceof TimeoutError) {
          this.errorMessage.set('Request timed out. Please check your connection and try again.');
        } else {
          this.errorMessage.set('Google sign-in failed. Please try again.');
        }
      },
    });
  }

  private triggerTermsShake(): void {
    // Reset first so the animation replays even if it's already mid-shake.
    this.shakeTerms.set(false);
    setTimeout(() => {
      this.shakeTerms.set(true);
      setTimeout(() => this.shakeTerms.set(false), 500);
    });
  }

  private resolveGoogleErrorMessage(errorCode?: string, message?: string): string {
    switch (errorCode) {
      case 'customer_auth.google_not_configured':
        return 'Google sign-in is not configured yet.';
      case 'customer_auth.google_verification_unavailable':
        return 'Google sign-in timed out while verifying your account. Please try again.';
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
