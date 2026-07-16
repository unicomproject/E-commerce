import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
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
export class EmailVerificationComponent implements OnInit {
  @Output() switchView = new EventEmitter<AuthView>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authModalService = inject(AuthModalService);

  email = 'john.smith@email.com'; // This would normally come from state/router

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

  isLoading = false;
  timer = 45;
  timerInterval: any;

  get digits() {
    return this.verificationForm.get('digits') as FormArray;
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timer = 45;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  resendCode() {
    if (this.timer > 0) return;
    // Call resend API here
    console.log('Resending code...');
    this.startTimer();
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      // Focus next input
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.digits.at(index).value && index > 0) {
      // Focus previous input on backspace if empty
      const prevInput = document.getElementById(`digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  onSubmit() {
    if (this.verificationForm.invalid) return;

    this.isLoading = true;
    const code = this.digits.value.join('');

    this.authService.verifyEmail({ email: this.email, code })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.authModalService.close();
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Verification error', err);
        }
      });
  }
}
