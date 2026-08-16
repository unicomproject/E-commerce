import { Component, OnInit, inject, output, signal , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AuthView, AuthModalService } from '../../../../core/services/auth-modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './reset-password.component.html',
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
export class ResetPasswordComponent implements OnInit {
  readonly switchView = output<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  token = '';
  openedFromResetLink = false;

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);

  get isInvalidLink(): boolean {
    return !this.email || !this.token;
  }

  ngOnInit() {
    const queryEmail = this.route.snapshot.queryParamMap.get('email') || '';
    const queryToken = this.route.snapshot.queryParamMap.get('token') || '';

    if (queryEmail && queryToken) {
      this.email = queryEmail;
      this.token = queryToken;
      this.openedFromResetLink = true;
      
      this.authModalService.open('reset-password');
      this.router.navigate([], { queryParams: {} });
    } else if (this.authModalService.passwordResetEmail && this.authModalService.passwordResetToken) {
      this.email = this.authModalService.passwordResetEmail;
      this.token = this.authModalService.passwordResetToken;
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit() {
    if (this.resetForm.invalid || this.isInvalidLink) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: newPassword!
    }).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.authModalService.clearPasswordResetContext();
            if (this.openedFromResetLink) {
              this.router.navigate(['/']);
              this.authModalService.open('login');
            } else {
              this.switchView.emit('login');
            }
          }
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
}
