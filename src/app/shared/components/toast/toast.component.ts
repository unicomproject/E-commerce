import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideCheckCircle2,
  lucideAlertCircle,
  lucideInfo,
  lucideAlertTriangle,
  lucideX,
} from '@ng-icons/lucide';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      lucideCheckCircle2,
      lucideAlertCircle,
      lucideInfo,
      lucideAlertTriangle,
      lucideX,
    }),
  ],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  toastService = inject(ToastService);
}
