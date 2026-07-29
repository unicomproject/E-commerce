import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideMail,
  lucideHelpCircle,
  lucideShieldCheck,
  lucidePackage,
  lucideStar
} from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthView, AuthModalService } from '../../../../core/services/auth-modal.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './forgot-password.html',
  viewProviders: [provideIcons({
    lucideMail,
    lucideHelpCircle,
    lucideShieldCheck,
    lucidePackage,
    lucideStar
  })]
})
export class ForgotPasswordComponent {
  readonly switchView = output<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = signal(false);
  emailSent = signal(false);
  submittedEmail = signal('');

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email } = this.forgotPasswordForm.value;
    this.submittedEmail.set(email!);

    this.authService.forgotPassword({ email: email! })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.emailSent.set(true);
            this.authModalService.setPasswordResetContext(email!);
          }
        },
        error: () => {
          this.isLoading.set(false);
          // AuthService already handles error toasts
        }
      });
  }
}
