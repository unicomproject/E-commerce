import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { AuthModalService, AuthView } from '../../../core/services/auth-modal.service';
import { LoginComponent } from '../../../features/auth/pages/login/login.component';
import { RegisterComponent } from '../../../features/auth/pages/register/register.component';
import { ForgotPasswordComponent } from '../../../features/auth/pages/forgot-password/forgot-password.component';
import { EmailVerificationComponent } from '../../../features/auth/pages/email-verification/email-verification.component';
import { ResetPasswordComponent } from '../../../features/auth/pages/reset-password/reset-password.component';
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
  templateUrl: './auth-modal.component.html',
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
