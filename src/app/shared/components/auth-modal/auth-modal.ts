import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { AuthModalService, AuthView } from '../../../core/services/auth-modal.service';
import { LoginComponent } from '../../../features/account/pages/login/login';
import { RegisterComponent } from '../../../features/account/pages/register/register';
import { ForgotPasswordComponent } from '../../../features/account/pages/forgot-password/forgot-password';
import { EmailVerificationComponent } from '../../../features/account/pages/email-verification/email-verification';
import { ResetPasswordComponent } from '../../../features/account/pages/reset-password/reset-password';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EmailVerificationComponent,
    ResetPasswordComponent,
    NgIconComponent,
  ],
  templateUrl: './auth-modal.html',
  viewProviders: [provideIcons({ lucideX })],
})
export class AuthModalComponent {
  readonly authModalService = inject(AuthModalService);

  close() {
    this.authModalService.close();
  }

  switchView(view: AuthView) {
    this.authModalService.switchView(view);
  }

  // Prevent clicks inside the modal from closing it
  onModalClick(event: Event) {
    event.stopPropagation();
  }
}
