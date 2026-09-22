import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideLock } from '@ng-icons/lucide';
import { CheckoutService } from '../../../../features/checkout/services/checkout.service';
import { CheckoutStepperComponent } from '../checkout-stepper/checkout-stepper.component';
import { CheckoutDetailsComponent } from '../checkout-details/checkout-details.component';
import { CheckoutReviewComponent } from '../checkout-review/checkout-review.component';
import { CheckoutSuccessComponent } from '../checkout-success/checkout-success.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [
    NgIconComponent,
    CheckoutStepperComponent,
    CheckoutDetailsComponent,
    CheckoutReviewComponent,
    CheckoutSuccessComponent,
  ],
  viewProviders: [provideIcons({ lucideX, lucideLock })],
  template: `
    @if (checkoutService.isOpen()) {
      <div
        class="fixed inset-0 z-[100] flex items-end lg:items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200"
        (click)="close()"
      >
        <!-- Modal Container: Full screen on mobile, popup on desktop -->
        <div
          class="relative w-full bg-white flex flex-col overflow-hidden
                 h-[100dvh]
                 lg:h-auto lg:max-h-[90vh] lg:max-w-[580px] lg:rounded-2xl lg:shadow-2xl lg:animate-none
                 animate-in slide-in-from-bottom duration-300"
          (click)="onModalClick($event)"
        >
          <!-- Header -->
          <div class="w-full border-b border-gray-100 flex justify-center shrink-0">
            <div class="w-full max-w-[550px] flex items-center justify-between px-6 pt-4 pb-2">
              <!-- Secure Icon -->
              <div class="flex items-center text-gray-500 text-sm font-medium">
                <ng-icon name="lucideLock" size="16" class="mr-1"></ng-icon>
                Secure
              </div>

              <h2 class="text-xl font-bold text-gray-900">Checkout</h2>

              <!-- Close Button -->
              <button
                (click)="close()"
                class="w-10 h-10 flex items-center justify-center -mr-2 text-gray-500 hover:text-gray-900 rounded-full transition-colors"
              >
                <ng-icon name="lucideX" size="24"></ng-icon>
              </button>
            </div>
          </div>

          <!-- Scrollable Content Views -->
          <div class="w-full flex-1 overflow-y-auto pb-safe flex justify-center">
            <div class="w-full max-w-[550px] p-6">
              <!-- Sticky Stepper -->
              <div class="sticky top-0 bg-white z-10 -mx-6 px-6 pt-6 pb-4 -mt-6">
                <app-checkout-stepper
                  [currentStep]="checkoutService.currentStep()"
                ></app-checkout-stepper>
              </div>

              <!-- Dynamic Steps -->
              @switch (checkoutService.currentStep()) {
                @case (1) {
                  <app-checkout-details></app-checkout-details>
                }
                @case (3) {
                  <app-checkout-review></app-checkout-review>
                }
                @case (4) {
                  <app-checkout-success></app-checkout-success>
                }
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CheckoutModalComponent {
  checkoutService = inject(CheckoutService);

  close() {
    this.checkoutService.closeCheckout();
  }

  onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
