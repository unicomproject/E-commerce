import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideXCircle } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payment-cancelled-page',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ lucideXCircle })],
  template: `
    <div class="max-w-lg mx-auto px-6 py-16 text-center">
      <div class="w-20 h-20 mx-auto bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
        <ng-icon name="lucideXCircle" size="48"></ng-icon>
      </div>
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Payment not completed</h2>
      <p class="text-gray-500 mb-8">
        Your order was not placed and you have not been charged. You can try again from your cart.
      </p>

      <div class="space-y-3">
        <button
          type="button"
          (click)="backToCart()"
          class="w-full py-3.5 bg-brand-orange text-white font-bold text-[15px] rounded-lg shadow-sm hover:bg-brand-orange-dark transition-colors"
        >
          Back to Cart
        </button>
        <button
          type="button"
          (click)="continueShopping()"
          class="w-full py-3.5 bg-white text-brand-orange border border-brand-orange/30 font-bold text-[15px] rounded-lg hover:bg-brand-orange/5 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  `,
})
export class PaymentCancelledPageComponent {
  private router = inject(Router);

  backToCart() {
    this.router.navigate(['/cart']);
  }

  continueShopping() {
    this.router.navigate(['/search']);
  }
}
