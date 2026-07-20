import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheckCircle2, lucideClock, lucideMail, lucideShoppingBag, lucideQrCode, lucideChevronRight } from '@ng-icons/lucide';
import { CheckoutService } from '../../../../core/services/checkout.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideCheckCircle2, lucideClock, lucideMail, lucideShoppingBag, lucideQrCode, lucideChevronRight })],
  template: `
    <div class="animate-in zoom-in-95 duration-500 flex flex-col items-center pt-4">
      
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
        <ng-icon name="lucideCheckCircle2" size="48"></ng-icon>
      </div>

      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Order Submitted!</h2>
        <p class="text-gray-500">
          Order #<span class="font-bold text-gray-900">{{ checkoutService.checkoutSession()?.checkoutNumber || '12345678' }}</span>
        </p>
      </div>

      <!-- Status Box -->
      <div class="w-full bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8">
        <div class="flex items-center gap-3 mb-3 pb-3 border-b border-orange-200/50">
          <div class="text-brand-orange">
            <ng-icon name="lucideClock" size="24"></ng-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <h4 class="font-bold text-gray-900">Pending store confirmation</h4>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Expected ready time:</span>
          <span class="font-bold text-gray-900">
            {{ formatTime(checkoutService.checkoutSession()?.requestedCollectionAt || '') }}
          </span>
        </div>
      </div>

      <!-- What happens next -->
      <div class="w-full mb-8">
        <h3 class="text-lg font-bold text-gray-900 mb-4">What happens next?</h3>
        
        <div class="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          
          <!-- Timeline Item 1 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <!-- Icon -->
            <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-orange-100 text-brand-orange shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <ng-icon name="lucideMail" size="20"></ng-icon>
            </div>
            <!-- Card -->
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h4 class="font-bold text-gray-900 mb-1">Order confirmed</h4>
              <p class="text-sm text-gray-500">We'll send you an email when the store accepts your order.</p>
            </div>
          </div>
          
          <!-- Timeline Item 2 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <!-- Icon -->
            <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <ng-icon name="lucideShoppingBag" size="20"></ng-icon>
            </div>
            <!-- Card -->
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h4 class="font-bold text-gray-900 mb-1">Ready for collection</h4>
              <p class="text-sm text-gray-500">We'll notify you when your items are ready to collect.</p>
            </div>
          </div>
          
          <!-- Timeline Item 3 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <!-- Icon -->
            <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <ng-icon name="lucideQrCode" size="20"></ng-icon>
            </div>
            <!-- Card -->
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h4 class="font-bold text-gray-900 mb-1">Bring your QR code</h4>
              <p class="text-sm text-gray-500">You'll need the QR code from your email to collect your order.</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Actions -->
      <div class="w-full space-y-3">
        <button 
          type="button" 
          (click)="viewOrder()"
          class="w-full py-4 bg-brand-orange text-white font-bold text-lg rounded-xl hover:bg-brand-orange-dark transition-colors"
        >
          View Order Details
        </button>
        
        <button 
          type="button" 
          (click)="continueShopping()"
          class="w-full py-4 bg-white text-gray-900 border-2 border-gray-200 font-bold text-lg rounded-xl hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

    </div>
  `
})
export class CheckoutSuccessComponent {
  checkoutService = inject(CheckoutService);
  router = inject(Router);

  viewOrder() {
    this.checkoutService.closeCheckout();
    // this.router.navigate(['/account/orders', this.checkoutService.checkoutSession()?.id]);
  }

  continueShopping() {
    this.checkoutService.closeCheckout();
    // this.router.navigate(['/']);
  }

  formatTime(isoString: string): string {
    if (!isoString) return '11:00 AM'; // Default mock fallback
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', { weekday: 'short' }) + ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}
