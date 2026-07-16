import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideStore, lucideClock, lucideChevronDown } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { Store } from '../../../../core/models';
import { OutletSelectorModalComponent } from '../outlet-selector-modal/outlet-selector-modal';

@Component({
  selector: 'app-fulfillment-selector',
  standalone: true,
  imports: [CommonModule, NgIcon, OutletSelectorModalComponent],
  viewProviders: [provideIcons({ lucideStore, lucideClock, lucideChevronDown })],
  template: `
    <div class="bg-white border-b border-neutral-200 relative z-40">
      <div class="py-2 px-3 lg:py-3 lg:px-4 max-w-7xl mx-auto">
        <!-- Single Box Container -->
        <div class="flex items-center bg-white border border-neutral-200 rounded-xl p-1.5 lg:p-2 shadow-sm">
          
          <!-- Store Selector -->
          <button (click)="openOutletModal()" class="flex-1 flex items-center justify-between group cursor-pointer text-left px-1 lg:px-2 overflow-hidden hover:bg-gray-50 rounded-lg py-1 transition-colors">
            <div class="flex items-center gap-1.5 lg:gap-2 overflow-hidden">
              <ng-icon name="lucideStore" class="text-lg lg:text-xl text-brand-orange flex-shrink-0"></ng-icon>
              <div class="overflow-hidden">
                <div class="text-[9px] lg:text-[10px] text-neutral-500 font-medium leading-none mb-1">Collect from</div>
                <div class="text-[10px] lg:text-xs font-bold text-brand-black leading-none truncate w-full">{{selectedStore?.name || 'Select Outlet'}}</div>
              </div>
            </div>
            <ng-icon name="lucideChevronDown" class="text-neutral-400 group-hover:text-neutral-600 text-sm ml-1 flex-shrink-0"></ng-icon>
          </button>

          <!-- Divider -->
          <div class="h-6 lg:h-8 w-px bg-neutral-200 mx-1 flex-shrink-0"></div>

          <!-- Time Selector -->
          <button class="flex-1 flex items-center justify-between group cursor-pointer text-left px-1 lg:px-2 overflow-hidden hover:bg-gray-50 rounded-lg py-1 transition-colors">
            <div class="flex items-center gap-1.5 lg:gap-2 overflow-hidden">
              <ng-icon name="lucideClock" class="text-lg lg:text-xl text-neutral-700 flex-shrink-0"></ng-icon>
              <div class="overflow-hidden">
                <div class="text-[9px] lg:text-[10px] text-neutral-500 font-medium leading-none mb-1">Collection</div>
                <div class="text-[10px] lg:text-xs font-bold text-brand-black leading-none truncate w-full">As soon as possible</div>
              </div>
            </div>
            <ng-icon name="lucideChevronDown" class="text-neutral-400 group-hover:text-neutral-600 text-sm ml-1 flex-shrink-0"></ng-icon>
          </button>

        </div>
      </div>
    </div>

    <app-outlet-selector-modal
      [isOpen]="isOutletModalOpen"
      [stores]="stores"
      [selectedStoreId]="selectedStore?.id || null"
      (close)="isOutletModalOpen = false"
      (selectStore)="onStoreSelected($event)"
    ></app-outlet-selector-modal>
  `
})
export class FulfillmentSelector implements OnInit {
  private storefrontData = inject(StorefrontDataService);
  
  stores: Store[] = [];
  selectedStore: Store | null = null;
  isOutletModalOpen = false;

  ngOnInit() {
    this.storefrontData.getStores().subscribe({
      next: (data) => {
        this.stores = data;
        if (this.stores.length > 0) {
          this.selectedStore = this.stores[0];
        }
      },
      error: (err) => console.error('Failed to fetch stores', err)
    });
  }

  openOutletModal() {
    this.isOutletModalOpen = true;
  }

  onStoreSelected(store: Store) {
    this.selectedStore = store;
    this.isOutletModalOpen = false;
  }
}
