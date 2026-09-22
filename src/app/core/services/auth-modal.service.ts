import { Injectable, inject, signal, effect } from '@angular/core';
import { GoogleIdentityService } from './google-identity.service';
import { BodyScrollLockService } from './body-scroll-lock.service';

export type AuthView = 'login' | 'register' | 'forgot-password' | 'verify' | 'reset-password';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private readonly googleIdentityService = inject(GoogleIdentityService);
  private readonly bodyScrollLock = inject(BodyScrollLockService);
  private readonly isOpenState = signal(false);
  readonly isOpen = this.isOpenState.asReadonly();

  private readonly viewState = signal<AuthView>('login');
  readonly view = this.viewState.asReadonly();

  private readonly pendingVerificationEmailState = signal('');
  readonly pendingVerificationEmailSignal = this.pendingVerificationEmailState.asReadonly();

  private readonly passwordResetEmailState = signal('');
  readonly passwordResetEmailSignal = this.passwordResetEmailState.asReadonly();

  private readonly passwordResetTokenState = signal('');
  readonly passwordResetTokenSignal = this.passwordResetTokenState.asReadonly();

  constructor() {
    let wasOpen = false;
    effect(() => {
      const open = this.isOpenState();
      if (open && !wasOpen) this.bodyScrollLock.lock();
      if (!open && wasOpen) this.bodyScrollLock.unlock();
      wasOpen = open;
    });
  }

  get pendingVerificationEmail(): string {
    return this.pendingVerificationEmailState();
  }

  get passwordResetEmail(): string {
    return this.passwordResetEmailState();
  }

  get passwordResetToken(): string {
    return this.passwordResetTokenState();
  }

  open(view: AuthView = 'login') {
    this.googleIdentityService.preload();
    this.viewState.set(view);
    this.isOpenState.set(true);
  }

  close() {
    this.isOpenState.set(false);
  }

  switchView(view: AuthView) {
    this.viewState.set(view);
  }

  setPendingVerificationEmail(email: string) {
    this.pendingVerificationEmailState.set(email.trim());
  }

  setPasswordResetContext(email: string, token: string = '') {
    this.passwordResetEmailState.set(email.trim());
    this.passwordResetTokenState.set(token.trim());
  }

  clearPasswordResetContext() {
    this.passwordResetEmailState.set('');
    this.passwordResetTokenState.set('');
  }
}
