import { Component, OnInit, OnDestroy, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { finalize } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideMail,
  lucideHelpCircle,
  lucideShieldCheck,
  lucideZap,
  lucidePackage
} from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthView, AuthModalService } from '../../../../core/services/auth-modal.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './email-verification.html',
  viewProviders: [provideIcons({
    lucideMail,
    lucideHelpCircle,
    lucideShieldCheck,
    lucideZap,
    lucidePackage
  })]
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
  readonly switchView = output<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private isDestroyed = false;

  email = '';

  verificationForm = this.fb.group({
    digits: this.fb.array([
      new FormControl('', [Validators.required, Validators.maxLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1)])
    ])
  });

  isLoading = signal(false);
  isResending = signal(false);
  timer = signal(45);
  timerInterval: ReturnType<typeof setInterval> | null = null;

  get digits() {
    return this.verificationForm.get('digits') as FormArray;
  }

  ngOnInit() {
    this.email = this.authModalService.pendingVerificationEmail;
    this.startTimer();
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timer.set(45);

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer.update(current => Math.max(current - 1, 0));

      if (this.timer() <= 0 && this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }, 1000);
  }

  resendCode() {
    if (this.timer() > 0 || !this.email || this.isResending()) return;

    this.isResending.set(true);
    this.authService.resendEmailVerification({ email: this.email })
      .subscribe({
        next: (response) => {
          this.isResending.set(false);
          if (response.success) {
            this.startTimer();
          }
        },
        error: () => {
          this.isResending.set(false);
          // AuthService already shows the API error toast.
        }
      });
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    this.digits.at(index).setValue(input.value);
    if (input.value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.digits.at(index).value && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  onSubmit() {
    if (this.verificationForm.invalid || !this.email) return;

    this.isLoading.set(true);
    const code = this.digits.value.join('');

    this.authService.verifyEmail({ email: this.email, code })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.switchView.emit('login');
          }
        },
        error: () => {
          this.isLoading.set(false);
          // AuthService already shows the API error toast.
        }
      });
  }
}
