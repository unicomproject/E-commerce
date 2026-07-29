import { Injectable, signal } from '@angular/core';

export type AuthView = 'login' | 'register' | 'forgot-password' | 'verify' | 'reset-password';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
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
    this.viewState.set(view);
    this.isOpenState.set(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpenState.set(false);
    document.body.style.overflow = '';
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
