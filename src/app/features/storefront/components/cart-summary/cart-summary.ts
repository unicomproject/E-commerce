import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, TenantCurrencyPipe, NgIconComponent],
  viewProviders: [provideIcons({ lucideArrowRight })],
  template: `
    <div class="fixed lg:static bottom-[calc(72px+env(safe-area-inset-bottom))] lg:bottom-auto left-0 right-0 z-40 lg:z-auto mt-0 lg:mt-0 bg-white p-5 lg:p-6 lg:rounded-xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-sm border-t lg:border border-gray-200">
      
      <h2 class="text-xl font-bold text-gray-900 mb-6 hidden lg:block">Order Summary</h2>

      <div class="flex justify-between items-center mb-4">
        <div class="text-gray-600 text-sm font-medium">Subtotal ({{ selectedCount() }} items)</div>
        <div class="text-gray-900 font-bold text-sm">{{cart().subtotal | tenantCurrency:'symbol':'1.2-2'}}</div>
      </div>

      @if (cart().discountTotal > 0) {
        <div class="flex justify-between items-center mb-6 bg-[#DCFCE7]/50 -mx-2 px-2 py-1.5 rounded">
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span class="text-[#22C55E] text-sm font-bold">You saved</span>
          </div>
          <div class="text-[#22C55E] font-bold text-sm">- {{cart().discountTotal | tenantCurrency:'symbol':'1.2-2'}}</div>
        </div>
      } @else {
        <div class="mb-6"></div>
      }

      <div class="border-t border-gray-100 pt-4 pb-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-lg font-bold text-gray-900">Total</div>
          </div>
          <div class="text-xl font-bold text-brand-orange">{{cart().grandTotal | tenantCurrency:'symbol':'1.2-2'}}</div>
        </div>
      </div>
      
      <div class="flex flex-col gap-3">
        <button (click)="onCheckout.emit()" [disabled]="selectedCount() === 0" class="w-full py-3.5 bg-brand-orange text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-between px-6 text-[15px] hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-orange">
          <span>Proceed to Checkout</span>
          <ng-icon name="lucideArrowRight" size="18"></ng-icon>
        </button>
        <a routerLink="/search" class="w-full py-3.5 bg-white text-brand-orange border border-brand-orange/30 font-bold rounded-lg hover:bg-brand-orange/5 transition-colors flex items-center justify-center text-center text-[15px]">
          Continue Shopping
        </a>
      </div>
    </div>
  `
})
export class CartSummary {
  cart = input.required<any>();
  selectedCount = input<number>(0);
  onCheckout = output<void>();
}
