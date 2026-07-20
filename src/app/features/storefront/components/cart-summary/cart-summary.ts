import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fixed lg:static bottom-[calc(72px+env(safe-area-inset-bottom))] lg:bottom-auto left-0 right-0 z-40 lg:z-auto mt-0 lg:mt-0 bg-white p-4 lg:p-6 lg:rounded-xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-sm border-t lg:border border-gray-200">
      
      <div class="flex justify-between items-center mb-1 lg:mb-2">
        <div class="text-gray-900 text-[15px]">Subtotal</div>
        <div class="text-gray-900 font-bold">\${{cart().subtotal | number:'1.2-2'}}</div>
      </div>
      
      @if (cart().taxTotal > 0) {
        <div class="flex justify-between items-center mb-3 lg:mb-4">
          <div class="text-gray-500 text-sm">VAT {{ cart().isTaxInclusive ? '(Included)' : '' }}</div>
          <div class="text-gray-500 text-sm">\${{cart().taxTotal | number:'1.2-2'}}</div>
        </div>
      }

      <div class="border-t border-gray-100 py-3 lg:py-4 mb-2">
        <div class="flex justify-between items-center">
          <div class="text-lg font-bold text-gray-900">Total</div>
          <div class="text-lg font-bold text-gray-900">\${{cart().grandTotal | number:'1.2-2'}}</div>
        </div>
      </div>
      
      <div class="flex flex-col gap-2 lg:gap-3">
        <a routerLink="/search" class="w-full py-2.5 lg:py-3 bg-white text-brand-orange border border-brand-orange font-bold rounded-lg hover:bg-brand-orange-light transition-colors flex items-center justify-center text-center">
          Continue Shopping
        </a>
        <button (click)="onCheckout.emit()" class="w-full py-2.5 lg:py-3 bg-brand-orange text-white font-bold rounded-lg shadow-sm hover:bg-brand-orange-dark transition-colors flex items-center justify-center text-center">
          Proceed to Checkout
        </button>
      </div>
    </div>
  `
})
export class CartSummary {
  cart = input.required<any>();
  onCheckout = output<void>();
}
