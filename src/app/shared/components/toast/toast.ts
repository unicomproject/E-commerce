import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheckCircle2, lucideAlertCircle, lucideInfo, lucideAlertTriangle, lucideX } from '@ng-icons/lucide';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideCheckCircle2, lucideAlertCircle, lucideInfo, lucideAlertTriangle, lucideX })],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 md:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-full fade-in"
          [ngClass]="{
            'bg-green-50/90 border-green-200 text-green-800': toast.type === 'success',
            'bg-red-50/90 border-red-200 text-red-800': toast.type === 'error',
            'bg-blue-50/90 border-blue-200 text-blue-800': toast.type === 'info',
            'bg-yellow-50/90 border-yellow-200 text-yellow-800': toast.type === 'warning'
          }"
        >
          <div class="flex-shrink-0 mt-0.5">
            <ng-icon *ngIf="toast.type === 'success'" name="lucideCheckCircle2" size="20" class="text-green-600"></ng-icon>
            <ng-icon *ngIf="toast.type === 'error'" name="lucideAlertCircle" size="20" class="text-red-600"></ng-icon>
            <ng-icon *ngIf="toast.type === 'info'" name="lucideInfo" size="20" class="text-blue-600"></ng-icon>
            <ng-icon *ngIf="toast.type === 'warning'" name="lucideAlertTriangle" size="20" class="text-yellow-600"></ng-icon>
          </div>
          
          <div class="flex-1 text-sm font-medium">
            {{ toast.message }}
          </div>
          
          <button 
            (click)="toastService.remove(toast.id)"
            class="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            <ng-icon name="lucideX" size="18"></ng-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
