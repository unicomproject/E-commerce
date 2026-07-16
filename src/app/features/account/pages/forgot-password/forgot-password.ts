import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
import { AuthView } from '../../../../core/services/auth-modal.service';

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
  @Output() switchView = new EventEmitter<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email } = this.forgotPasswordForm.value;

    this.authService.forgotPassword({ email: email! })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Usually we show a success message or navigate to a "check your email" page
            // For now, we'll navigate to reset password directly for demonstration purposes
            this.switchView.emit('reset-password');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Forgot password error', err);
        }
      });
  }
}
