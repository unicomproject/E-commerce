import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheckCircle2, lucideClock } from '@ng-icons/lucide';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payment-success-page',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ lucideCheckCircle2, lucideClock })],
  template: `
    <div class="max-w-lg mx-auto px-6 py-16 text-center">
      @if (isLoading()) {
        <div class="flex flex-col items-center gap-4">
          <span class="border-4 border-brand-orange border-t-transparent rounded-full w-10 h-10 animate-spin"></span>
          <p class="text-gray-500">Confirming your payment...</p>
        </div>
      } @else {
        <div class="w-20 h-20 mx-auto bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <ng-icon name="lucideCheckCircle2" size="48"></ng-icon>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Payment successful!</h2>
        @if (orderNumber()) {
          <p class="text-gray-500 mb-8">
            Order Number <span class="font-bold text-gray-900">{{ orderNumber() }}</span>
          </p>
        } @else {
          <p class="text-gray-500 mb-8">
            We're confirming your payment. You'll receive an email once your order is confirmed.
          </p>
        }

        <div class="space-y-3">
          <button
            type="button"
            (click)="viewOrder()"
            class="w-full py-3.5 bg-brand-orange text-white font-bold text-[15px] rounded-lg shadow-sm hover:bg-brand-orange-dark transition-colors"
          >
            View Order Details
          </button>
          <button
            type="button"
            (click)="continueShopping()"
            class="w-full py-3.5 bg-white text-brand-orange border border-brand-orange/30 font-bold text-[15px] rounded-lg hover:bg-brand-orange/5 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      }
    </div>
  `,
})
export class PaymentSuccessPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  checkoutService = inject(CheckoutService);

  isLoading = signal(true);

  orderNumber(): string | undefined {
    return this.checkoutService.checkoutSession()?.order?.orderNumber;
  }

  ngOnInit() {
    const checkoutId = this.route.snapshot.queryParamMap.get('checkoutId');
    if (!checkoutId) {
      this.isLoading.set(false);
      return;
    }

    this.checkoutService.sessionId.set(checkoutId);
    this.checkoutService.getSession(checkoutId).subscribe(() => {
      this.isLoading.set(false);
      this.cartService.clearLocalState();
    });
  }

  viewOrder() {
    const orderId = this.checkoutService.checkoutSession()?.order?.id;
    this.router.navigate(orderId ? ['/account/orders', orderId] : ['/account/orders']);
  }

  continueShopping() {
    this.router.navigate(['/search']);
  }
}
