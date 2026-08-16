import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideStore,
  lucideMapPin,
  lucideCalendar,
  lucideEdit2,
  lucideLock,
  lucideCheckCircle2,
  lucideInfo,
  lucideArrowLeft,
} from '@ng-icons/lucide';
import { CheckoutService } from '../../../../features/checkout/services/checkout.service';
import { StorefrontDataService } from '../../../catalog/services/catalog.service';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';
import { CollectionTimeModalComponent } from '../collection-time-modal/collection-time-modal.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout-review',
  standalone: true,
  imports: [NgIconComponent, TenantCurrencyPipe, CollectionTimeModalComponent],
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideMail,
      lucidePhone,
      lucideStore,
      lucideMapPin,
      lucideCalendar,
      lucideEdit2,
      lucideLock,
      lucideCheckCircle2,
      lucideInfo,
      lucideArrowLeft,
    }),
  ],
  template: `
    <div class="animate-in fade-in duration-300">
      <!-- Header -->
      <div class="pt-2 pb-4 flex items-center gap-2 sticky top-0 z-40 bg-white">
        <button (click)="goBack()" class="lg:hidden flex-shrink-0 p-1.5 -ml-1.5 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#111111]">
          <ng-icon name="lucideArrowLeft" class="text-[24px]"></ng-icon>
        </button>
        <h1 class="text-[20px] font-bold text-[#111111] leading-none pt-0.5 truncate">Order Review</h1>
      </div>

      <!-- Content below header -->
      @if (checkoutService.checkoutSession() !== null) {
        <!-- Customer Details -->
        <div
          class="border border-gray-100 bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-4 mb-4 relative group"
        >
          <div class="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
            <h3 class="text-base font-bold text-gray-900">Customer Details</h3>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-3 text-gray-700">
              <ng-icon name="lucideUser" size="18" class="text-gray-400 shrink-0"></ng-icon>
              <span class="text-sm">{{
                checkoutService.checkoutSession()!.pickupContactName
              }}</span>
            </div>
            <div class="w-full border-t border-gray-100 pl-8"></div>
            <div class="flex items-center gap-3 text-gray-700">
              <ng-icon name="lucideMail" size="18" class="text-gray-400 shrink-0"></ng-icon>
              <span class="text-sm">{{
                checkoutService.checkoutSession()!.pickupContactEmail
              }}</span>
            </div>
            <div class="w-full border-t border-gray-100 pl-8"></div>
            <div class="flex items-center gap-3 text-gray-700">
              <ng-icon name="lucidePhone" size="18" class="text-gray-400 shrink-0"></ng-icon>
              <span class="text-sm">{{
                checkoutService.checkoutSession()!.pickupContactPhone
              }}</span>
            </div>
          </div>
        </div>

        <!-- Collection Details -->
        <div
          class="border border-gray-100 bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-4 mb-4 relative group"
        >
          <div class="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
            <h3 class="text-base font-bold text-gray-900">Collection Details</h3>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-gray-700">
                <ng-icon name="lucideStore" size="18" class="text-gray-400 shrink-0"></ng-icon>
                <span class="text-sm">{{
                  checkoutService.checkoutSession()!.selectedOutletName
                }}</span>
              </div>
              @if (storefrontData.availableStores().length > 1) {
                <button
                  (click)="editCollection()"
                  class="text-brand-orange text-sm font-medium flex items-center hover:underline"
                >
                  Edit <ng-icon name="lucideEdit2" size="14" class="ml-1"></ng-icon>
                </button>
              }
            </div>
            <div class="w-full border-t border-gray-100 pl-8"></div>
            <div class="flex items-center gap-3 text-gray-700">
              <ng-icon name="lucideMapPin" size="18" class="text-gray-400 shrink-0"></ng-icon>
              <span class="text-sm">Pick up from the collection point</span>
            </div>
            <div class="w-full border-t border-gray-100 pl-8"></div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-gray-900 font-medium">
                <ng-icon name="lucideCalendar" size="18" class="text-gray-400 shrink-0"></ng-icon>
                <span class="text-sm">
                  {{ formatDate(checkoutService.checkoutSession()!.requestedCollectionAt!) }} •
                  {{ formatTime(checkoutService.checkoutSession()!.requestedCollectionAt!) }}
                </span>
              </div>
              <button
                (click)="openTimeModal()"
                class="text-brand-orange text-sm font-medium flex items-center hover:underline"
              >
                Edit <ng-icon name="lucideEdit2" size="14" class="ml-1"></ng-icon>
              </button>
            </div>
          </div>
        </div>
        <!-- Collection Alert Banner -->
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3 mb-6">
          <div class="text-blue-500 mt-0.5 shrink-0">
            <ng-icon name="lucideInfo" size="18"></ng-icon>
          </div>
          <div class="text-[13px] text-blue-800 font-medium leading-tight pt-0.5">
            Please confirm your collection date and time before ordering.
          </div>
        </div>

        <!-- Your Items -->
        <div class="mb-6">
          <h3 class="text-[17px] font-bold text-gray-900 mb-3">
            Your Items ({{ checkoutService.checkoutSession()!.totalQuantity }})
          </h3>

          <div
            class="border border-gray-100 bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-4"
          >
            <div class="space-y-4 mb-4">
              @for (item of checkoutService.checkoutSession()!.items; track item.id) {
                <div class="flex gap-4 items-start">
                  <!-- Product Image -->
                  <div
                    class="w-[84px] h-[64px] bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-gray-100"
                  >
                    @if (item.imageUrl) {
                      <img
                        [src]="item.imageUrl"
                        [alt]="item.productName"
                        class="w-full h-full object-cover"
                      />
                    } @else {
                      <span class="text-xs text-gray-400">Image</span>
                    }
                  </div>

                  <div class="flex-1 min-w-0 pt-1">
                    <h4 class="font-bold text-[15px] text-gray-900 leading-tight truncate">
                      {{ item.productName }}
                    </h4>
                    <p class="text-gray-400 text-xs mt-1 uppercase">{{ item.sku || 'N/A' }}</p>
                    <p class="text-gray-500 text-sm mt-1">Qty: {{ item.quantity }}</p>
                  </div>

                  <div class="shrink-0 pt-1">
                    <span class="font-bold text-[15px] text-gray-900">{{
                      item.lineTotal | tenantCurrency: 'symbol' : '1.2-2'
                    }}</span>
                  </div>
                </div>
              }
            </div>

            <!-- Order Summary Totals -->
            <div class="border-t border-gray-100 pt-4 space-y-2">
              <div class="flex justify-between text-gray-500 text-[13px]">
                <span>Subtotal</span>
                <span>{{
                  checkoutService.checkoutSession()!.subtotal | tenantCurrency: 'symbol' : '1.2-2'
                }}</span>
              </div>
              @if (checkoutService.checkoutSession()!.discountTotal > 0) {
                <div class="flex justify-between text-green-600 text-[13px]">
                  <span>Discount</span>
                  <span
                    >-{{
                      checkoutService.checkoutSession()!.discountTotal
                        | tenantCurrency: 'symbol' : '1.2-2'
                    }}</span
                  >
                </div>
              }
              <div class="flex justify-between text-gray-500 text-[13px]">
                  <span>VAT</span>
                <span>{{
                  checkoutService.checkoutSession()!.taxTotal | tenantCurrency: 'symbol' : '1.2-2'
                }}</span>
              </div>
            </div>

            <div class="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span class="font-bold text-[15px] text-gray-900">Total to Pay</span>
              <span class="font-bold text-lg text-gray-900">{{
                checkoutService.checkoutSession()!.grandTotal | tenantCurrency: 'symbol' : '1.2-2'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="sticky bottom-0 bg-white pt-4 pb-4 md:pb-6 z-10 -mx-6 px-6 -mb-6 flex flex-col items-center border-t border-gray-100"
        >
          <button
            type="button"
            [disabled]="checkoutService.isLoading()"
            (click)="onConfirmOrder()"
            class="w-full py-[14px] bg-brand-orange text-white font-bold text-base rounded-xl hover:bg-brand-orange-dark transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(255,102,0,0.3)] mb-4"
          >
            @if (checkoutService.isLoading()) {
              <span
                class="mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"
              ></span>
            }
            @if (!checkoutService.isLoading()) {
              <ng-icon name="lucideLock" size="18" class="mr-2"></ng-icon>
            }
            Place Collection Order •
            {{ checkoutService.checkoutSession()!.grandTotal | tenantCurrency: 'symbol' : '1.0-0' }}
          </button>
        </div>
      } @else {
        <div class="text-center py-10 text-gray-500">Loading order review...</div>
      }

      <app-collection-time-modal
        [isOpen]="isTimeModalOpen()"
        [outletId]="checkoutService.checkoutSession()?.selectedOutletId || null"
        (close)="isTimeModalOpen.set(false)"
        (confirm)="onTimeConfirmed($event)"
      ></app-collection-time-modal>
    </div>
  `,
})
export class CheckoutReviewComponent {
  checkoutService = inject(CheckoutService);
  storefrontData = inject(StorefrontDataService);
  toastService = inject(ToastService);

  isTimeModalOpen = signal(false);

  goBack() {
    this.checkoutService.setStep(2);
  }

  editCollection() {
    this.checkoutService.isFastTracked.set(false);
    this.checkoutService.setStep(2);
  }

  onConfirmOrder() {
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

  openTimeModal() {
    this.isTimeModalOpen.set(true);
  }

  onTimeConfirmed(selection: {
    type: 'asap' | 'later';
    date?: string;
    time?: string;
    isoString?: string;
  }) {
    if (!selection.isoString) return;

    const session = this.checkoutService.checkoutSession();
    if (!session?.selectedOutletId) return;

    this.checkoutService
      .updateCollection({
        selectedOutletId: session.selectedOutletId,
        requestedCollectionAt: selection.isoString,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.isTimeModalOpen.set(false);
            this.storefrontData.requestedCollectionAt.set(selection.isoString!);
            if (selection.type === 'asap') {
              this.storefrontData.selectedTimeText.set('As soon as possible');
            } else {
              const dateStr = selection.date === 'Today' ? 'Today' : selection.date;
              this.storefrontData.selectedTimeText.set(`${selection.time}, ${dateStr}`);
            }
          } else {
            this.toastService.error(res.message || 'Some items are not available for this time.');
          }
        },
        error: (err: any) => {
          this.toastService.error('Failed to update collection time. Please try again.');
        }
      });
  }
}
