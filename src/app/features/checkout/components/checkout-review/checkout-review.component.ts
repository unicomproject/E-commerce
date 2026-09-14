import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';

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
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { CollectionTimeModalComponent } from '../collection-time-modal/collection-time-modal.component';
import { OutletSelectorModalComponent } from '../outlet-selector-modal/outlet-selector-modal.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout-review',
  standalone: true,
  imports: [NgIconComponent, PriceComponent, CollectionTimeModalComponent, OutletSelectorModalComponent],
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
      <!-- Header removed -->

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
                <button
                  (click)="editCollection()"
                  class="text-brand-orange text-sm font-medium flex items-center hover:underline"
                >
                  Change <ng-icon name="lucideEdit2" size="14" class="ml-1"></ng-icon>
                </button>
            </div>

            <div class="w-full border-t border-gray-100 pl-8"></div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-gray-900 font-medium">
                <ng-icon name="lucideCalendar" size="18" class="text-gray-400 shrink-0"></ng-icon>
                <span class="text-sm">
                  @if (checkoutService.checkoutSession()?.requestedCollectionAt) {
                    {{ formatDate(checkoutService.checkoutSession()!.requestedCollectionAt!) }} •
                    {{ formatTime(checkoutService.checkoutSession()!.requestedCollectionAt!) }}
                  } @else {
                    <span class="text-brand-orange font-semibold cursor-pointer" (click)="openTimeModal()">Select a collection time</span>
                  }
                </span>
              </div>
              <button
                (click)="openTimeModal()"
                class="text-brand-orange text-sm font-medium flex items-center hover:underline"
              >
                Change <ng-icon name="lucideEdit2" size="14" class="ml-1"></ng-icon>
              </button>
            </div>
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
                    <span class="font-bold text-[15px] text-gray-900"><app-price [value]="item.lineTotal"></app-price></span>
                  </div>
                </div>
              }
            </div>

            <!-- Order Summary Totals -->
            <div class="border-t border-gray-100 pt-4 space-y-2">
              <div class="flex justify-between text-gray-500 text-[13px]">
                <span>Subtotal</span>
                <span><app-price [value]="checkoutService.checkoutSession()!.subtotal"></app-price></span>
              </div>
              @if (checkoutService.checkoutSession()!.discountTotal > 0) {
                <div class="flex justify-between text-green-600 text-[13px]">
                  <span>Discount</span>
                  <span
                    >-<app-price [value]="checkoutService.checkoutSession()!.discountTotal"></app-price></span
                  >
                </div>
              }
              <div class="flex justify-between text-gray-500 text-[13px]">
                  <span>VAT</span>
                <span><app-price [value]="checkoutService.checkoutSession()!.taxTotal"></app-price></span>
              </div>
            </div>

            <div class="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span class="font-bold text-[15px] text-gray-900">Total to Pay</span>
              <span class="font-bold text-lg text-gray-900"><app-price [value]="checkoutService.checkoutSession()!.grandTotal"></app-price></span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="mb-6">
          <h3 class="text-[17px] font-bold text-gray-900 mb-3">Payment Method</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              (click)="checkoutService.selectedPaymentMethod.set('PAY_AT_PICKUP')"
              class="border rounded-xl p-3 text-left text-sm font-medium transition-colors"
              [class.border-brand-orange]="checkoutService.selectedPaymentMethod() === 'PAY_AT_PICKUP'"
              [class.bg-orange-50]="checkoutService.selectedPaymentMethod() === 'PAY_AT_PICKUP'"
              [class.border-gray-100]="checkoutService.selectedPaymentMethod() !== 'PAY_AT_PICKUP'"
            >
              Pay at pickup
            </button>
            <button
              type="button"
              (click)="checkoutService.selectedPaymentMethod.set('STRIPE')"
              class="border rounded-xl p-3 text-left text-sm font-medium transition-colors"
              [class.border-brand-orange]="checkoutService.selectedPaymentMethod() === 'STRIPE'"
              [class.bg-orange-50]="checkoutService.selectedPaymentMethod() === 'STRIPE'"
              [class.border-gray-100]="checkoutService.selectedPaymentMethod() !== 'STRIPE'"
            >
              Pay online with card
            </button>
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
            @if (checkoutService.selectedPaymentMethod() === 'STRIPE') {
              Pay Now •
            } @else {
              Place Collection Order •
            }
            <app-price [value]="checkoutService.checkoutSession()!.grandTotal"></app-price>
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

      <app-outlet-selector-modal
        [isOpen]="isOutletModalOpen()"
        [stores]="checkoutService.availableStores()"
        [selectedStoreId]="checkoutService.checkoutSession()?.selectedOutletId || null"
        (close)="isOutletModalOpen.set(false)"
        (selectStore)="onOutletSelected($event)"
      ></app-outlet-selector-modal>
    </div>
  `,
})
export class CheckoutReviewComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  storefrontData = inject(StorefrontDataService);
  toastService = inject(ToastService);

  isTimeModalOpen = signal(false);
  isOutletModalOpen = signal(false);

  ngOnInit() {
    if (this.checkoutService.availableStores().length === 0) {
      this.checkoutService.getStores().subscribe();
    }
  }

  goBack() {
    this.checkoutService.setStep(1); // Since step 2 is removed, go back to step 1
  }

  editCollection() {
    this.isOutletModalOpen.set(true);
  }

  onOutletSelected(store: any) {
    this.isOutletModalOpen.set(false);
    const currentCollectionTime = this.checkoutService.checkoutSession()?.requestedCollectionAt || '';
    
    this.checkoutService
      .updateCollection({
        selectedOutletId: store.id,
        requestedCollectionAt: currentCollectionTime
      })
      .subscribe({
        next: () => {
          // Open time modal so user can pick a new time for the newly selected outlet
          this.isTimeModalOpen.set(true);
        },
      });
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
