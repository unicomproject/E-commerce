import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideLock } from '@ng-icons/lucide';
import { CheckoutService } from '../../../../features/checkout/services/checkout.service';
import { CheckoutStepperComponent } from '../checkout-stepper/checkout-stepper';
import { CheckoutDetailsComponent } from '../checkout-details/checkout-details';
import { CheckoutCollectionComponent } from '../checkout-collection/checkout-collection';
import { CheckoutReviewComponent } from '../checkout-review/checkout-review';
import { CheckoutSuccessComponent } from '../checkout-success/checkout-success';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [
    NgIconComponent,
    CheckoutStepperComponent,
    CheckoutDetailsComponent,
    CheckoutCollectionComponent,
    CheckoutReviewComponent,
    CheckoutSuccessComponent,
  ],
  viewProviders: [provideIcons({ lucideX, lucideLock })],
  template: `
    @if (checkoutService.isOpen()) {
      <div
        class="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200"
        (click)="close()"
      >
        <!-- Modal Container (Full Screen) -->
        <div
          class="relative w-full h-[100dvh] md:h-screen md:max-h-none md:max-w-none bg-white shadow-none flex flex-col animate-in slide-in-from-bottom duration-300 md:slide-in-from-bottom-0 md:zoom-in-95"
          (click)="onModalClick($event)"
        >
          <!-- Header -->
          <div class="w-full border-b border-gray-100 flex justify-center">
            <div class="w-full max-w-[550px] flex items-center justify-between px-6 pt-4 pb-2">
              <!-- Close Button -->
              <button
                (click)="close()"
                class="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full transition-colors"
              >
                <ng-icon name="lucideX" size="24"></ng-icon>
              </button>

              <h2 class="text-xl font-bold text-gray-900">Checkout</h2>

              <!-- Secure Icon -->
              <div class="flex items-center text-gray-500 text-sm font-medium">
                <ng-icon name="lucideLock" size="16" class="mr-1"></ng-icon>
                Secure
              </div>
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
                @case (2) {
                  <app-checkout-collection></app-checkout-collection>
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
