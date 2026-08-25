import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { AuthModalService, AuthView } from '../../../core/services/auth-modal.service';
import { LoginComponent } from '../../../features/auth/pages/login/login.component';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    LoginComponent,

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
