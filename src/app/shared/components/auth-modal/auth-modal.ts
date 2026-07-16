import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalService, AuthView } from '../../../core/services/auth-modal.service';
import { LoginComponent } from '../../../features/account/pages/login/login';
import { RegisterComponent } from '../../../features/account/pages/register/register';
import { ForgotPasswordComponent } from '../../../features/account/pages/forgot-password/forgot-password';
import { EmailVerificationComponent } from '../../../features/account/pages/email-verification/email-verification';
import { ResetPasswordComponent } from '../../../features/account/pages/reset-password/reset-password';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule, 
    LoginComponent, 
    RegisterComponent, 
    ForgotPasswordComponent, 
    EmailVerificationComponent, 
    ResetPasswordComponent,
    NgIconComponent
  ],
  templateUrl: './auth-modal.html',
  viewProviders: [provideIcons({ lucideX })]
})
export class AuthModalComponent implements OnInit {
  authModalService = inject(AuthModalService);
  isOpen = false;
  currentView: AuthView = 'login';

  ngOnInit() {
    this.authModalService.isOpen$.subscribe(isOpen => this.isOpen = isOpen);
    this.authModalService.view$.subscribe(view => this.currentView = view);
  }

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
