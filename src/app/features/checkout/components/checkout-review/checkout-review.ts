import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideCalendar, lucideEdit2, lucideShieldCheck } from '@ng-icons/lucide';
import { CheckoutService } from '../../../../core/services/checkout.service';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideMapPin, lucideCalendar, lucideEdit2, lucideShieldCheck })],
  template: `
    <div class="animate-in fade-in duration-300">
      
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Order Review</h2>
        <p class="text-gray-500 text-sm">Please review your order details before placing the order.</p>
      </div>

      @if (checkoutService.checkoutSession() !== null) {
        
        <!-- Order Items -->
        <div class="mb-8">
          <h3 class="text-md font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Your Items ({{ checkoutService.checkoutSession()!.totalQuantity }})</h3>
          
          <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
            @for (item of checkoutService.checkoutSession()!.items; track item.id) {
              <div class="flex gap-4">
                <!-- Product Image Placeholder -->
                <div class="w-20 h-24 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                  <span class="text-xs text-gray-400">Image</span>
                </div>
                
                <div class="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 class="font-bold text-gray-900 leading-tight">{{ item.productName }}</h4>
                    <p class="text-gray-500 text-xs mt-1">{{ item.sku || 'N/A' }}</p>
                  </div>
                  
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-sm font-medium text-gray-600">Qty: {{ item.quantity }}</span>
                    <span class="font-bold text-gray-900">\${{ item.lineTotal | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Collection Summary Box -->
        <div class="border-2 border-gray-100 bg-gray-50/50 rounded-2xl p-5 mb-8 relative group">
          <button 
            (click)="checkoutService.setStep(2)"
            class="absolute top-4 right-4 text-brand-orange text-sm font-bold flex items-center hover:underline bg-white px-3 py-1.5 rounded-full shadow-sm"
          >
            <ng-icon name="lucideEdit2" size="14" class="mr-1.5"></ng-icon> Change
          </button>
          
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Collection Details</h3>
          
          <div class="flex gap-3 mb-3">
            <div class="text-gray-400 mt-0.5"><ng-icon name="lucideMapPin" size="20"></ng-icon></div>
            <div>
              <p class="font-bold text-gray-900">{{ checkoutService.checkoutSession()!.selectedOutletName }}</p>
              <!-- Note: Ideally address would be from the store model or API -->
              <p class="text-sm text-gray-500">Pick up from the collection point</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="text-gray-400 mt-0.5"><ng-icon name="lucideCalendar" size="20"></ng-icon></div>
            <div>
              <p class="font-bold text-gray-900">
                {{ formatDate(checkoutService.checkoutSession()!.requestedCollectionAt!) }} 
                at {{ formatTime(checkoutService.checkoutSession()!.requestedCollectionAt!) }}
              </p>
              <p class="text-sm text-gray-500">Please bring your confirmation email</p>
            </div>
          </div>
        </div>

        <!-- Order Summary Totals -->
        <div class="bg-gray-50 rounded-2xl p-5 mb-8">
          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>\${{ checkoutService.checkoutSession()!.subtotal | number:'1.2-2' }}</span>
            </div>
            @if (checkoutService.checkoutSession()!.discountTotal > 0) {
              <div class="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-\${{ checkoutService.checkoutSession()!.discountTotal | number:'1.2-2' }}</span>
              </div>
            }
            <div class="flex justify-between text-gray-600">
              <span>VAT (included)</span>
              <span>\${{ checkoutService.checkoutSession()!.taxTotal | number:'1.2-2' }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4 flex justify-between items-end">
            <span class="font-bold text-gray-900 text-lg">Total to Pay</span>
            <span class="font-bold text-gray-900 text-2xl">\${{ checkoutService.checkoutSession()!.grandTotal | number:'1.2-2' }}</span>
          </div>
        </div>

        <!-- Secure Order Banner -->
        <div class="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
          <ng-icon name="lucideShieldCheck" size="18"></ng-icon>
          <span>Payment is securely processed in-store at collection</span>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <button 
            type="button" 
            [disabled]="checkoutService.isLoading()"
            (click)="onConfirmOrder()"
            class="w-full py-4 bg-brand-orange text-white font-bold text-lg rounded-xl hover:bg-brand-orange-dark transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span *ngIf="checkoutService.isLoading()" class="mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
            Place Collection Order
          </button>
        </div>

      } @else {
        <div class="text-center py-10 text-gray-500">
          Loading order review...
        </div>
      }
    </div>
  `
})
export class CheckoutReviewComponent {
  checkoutService = inject(CheckoutService);

  onConfirmOrder() {
    // Keep under backend's 50-character Idempotency-Key limit.
    const randomSuffix = Math.random().toString(36).slice(2, 10);
    const idempotencyKey = `co_${Date.now()}_${randomSuffix}`;
    this.checkoutService.confirmOrder(idempotencyKey).subscribe();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  formatTime(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}
