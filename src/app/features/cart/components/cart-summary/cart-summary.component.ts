import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { StorefrontCartReadModel } from '../../../../features/cart/models/cart.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart-summary',
  standalone: true,
  imports: [RouterLink, PriceComponent, NgIconComponent],
  viewProviders: [provideIcons({ lucideArrowRight })],
  template: `
    <div
      class="fixed lg:static bottom-[calc(72px+env(safe-area-inset-bottom))] lg:bottom-auto left-0 right-0 z-40 lg:z-auto mt-0 lg:mt-0 bg-white p-5 lg:p-6 lg:rounded-xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-sm border-t lg:border border-gray-200"
    >
      <h2 class="text-xl font-bold text-gray-900 mb-6 hidden lg:block">Order Summary</h2>

      @if (selectedDiscountTotal() > 0) {
        <div
          class="flex justify-between items-center mb-6 bg-[#DCFCE7]/50 -mx-2 px-2 py-1.5 rounded"
        >
          <div class="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22C55E"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span class="text-[#22C55E] text-sm font-bold">You saved</span>
          </div>
          <div class="text-[#22C55E] font-bold text-sm">
            - <app-price [value]="selectedDiscountTotal()"></app-price>
          </div>
        </div>
      }

      <div class="pb-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-lg font-bold text-gray-900">Total</div>
            @if (selectedCount() > 0) {
              <div class="text-xs text-gray-500 mt-0.5">
                {{ selectedCount() }} item{{ selectedCount() === 1 ? '' : 's' }} selected
              </div>
            }
          </div>
          <div class="text-xl font-bold text-brand-orange">
            <app-price [value]="selectedTotal()"></app-price>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button
          (click)="onCheckout.emit()"
          [disabled]="selectedCount() === 0 || isStarting()"
          class="w-full py-3.5 bg-brand-orange text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-between px-6 text-[15px] hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-orange"
        >
          <span>{{ isStarting() ? 'Preparing checkout...' : 'Proceed to Checkout' }}</span>
          <ng-icon name="lucideArrowRight" size="18"></ng-icon>
        </button>
        <a
          routerLink="/search"
          class="w-full py-3.5 bg-white text-brand-orange border border-brand-orange/30 font-bold rounded-lg hover:bg-brand-orange/5 transition-colors flex items-center justify-center text-center text-[15px]"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  `,
})
export class CartSummary {
  cart = input.required<StorefrontCartReadModel>();
  selectedItemIds = input<ReadonlySet<string>>(new Set());
  selectedCount = input<number>(0);
  isStarting = input<boolean>(false);
  onCheckout = output<void>();

  private selectedItems = computed(() => {
    const ids = this.selectedItemIds();
    return (this.cart()?.items ?? []).filter((item) => ids.has(item.id));
  });

  readonly selectedTotal = computed(() =>
    this.selectedItems().reduce((sum, item) => sum + (item.lineTotal ?? 0), 0),
  );

  readonly selectedDiscountTotal = computed(() =>
    this.selectedItems().reduce((sum, item) => sum + (item.discountTotal ?? 0), 0),
  );
}
