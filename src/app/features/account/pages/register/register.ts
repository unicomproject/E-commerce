import { Component, inject, Output, EventEmitter } from '@angular/core';
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
import { AuthView } from '../../../../core/services/auth-modal.service';

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
  @Output() switchView = new EventEmitter<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    agreeTerms: [false, Validators.requiredTrue],
    sendOffers: [false]
  }, { validators: this.passwordMatchValidator });

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  passwordMatchValidator(g: any) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { firstName, lastName, email, mobile, password, agreeTerms, sendOffers } = this.registerForm.value;

    this.authService.register({ 
      firstName: firstName!, 
      lastName: lastName!, 
      email: email!, 
      mobile: mobile!, 
      password: password!, 
      agreeTerms: agreeTerms!, 
      sendOffers: sendOffers! 
    }).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Redirect to email verification page after registration
            this.switchView.emit('verify');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Registration error', err);
        }
      });
  }
}
