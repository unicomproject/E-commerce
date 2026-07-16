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
  lucideShieldCheck,
  lucideKey,
  lucideHelpCircle
} from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthView } from '../../../../core/services/auth-modal.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './reset-password.html',
  viewProviders: [provideIcons({ 
    lucideMail, 
    lucideLock, 
    lucideEye, 
    lucideEyeOff,
    lucideShieldCheck,
    lucideKey,
    lucideHelpCircle
  })]
})
export class ResetPasswordComponent {
  @Output() switchView = new EventEmitter<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  email = 'john.smith@email.com'; // This would usually come from a route query param or token payload

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  passwordMatchValidator(g: any) {
    return g.get('newPassword').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword({ email: this.email, newPassword: newPassword! })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.switchView.emit('login');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Reset password error', err);
        }
      });
  }
}
