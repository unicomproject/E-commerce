import { Component, inject, OnInit, signal } from '@angular/core';
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
    <div class="bg-white relative z-40">
      <div class="py-2 px-3 lg:py-3 lg:px-4 w-full mx-auto">
        <div class="flex items-center">
          <button 
            (click)="openOutletModal()" 
            class="flex items-center gap-2.5 lg:gap-3 pr-4 pl-1.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-all duration-300 active:scale-95 group border border-transparent hover:border-neutral-300"
          >
            <!-- Circular Icon Container -->
            <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-orange group-hover:scale-110 transition-transform duration-300">
              <ng-icon name="lucideStore" class="text-sm lg:text-base"></ng-icon>
            </div>
            
            <!-- Text Content -->
            <div class="flex flex-col text-left justify-center">
              <span class="text-[9px] lg:text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mb-1">Pickup Store</span>
              <span class="text-xs lg:text-sm font-extrabold text-brand-black leading-tight">
                {{ selectedStore()?.name || 'Select Outlet' }}
              </span>
            </div>

            <!-- Arrow -->
            <ng-icon name="lucideChevronDown" class="text-neutral-400 group-hover:text-neutral-800 transition-colors ml-1 lg:ml-2 text-sm"></ng-icon>
          </button>
        </div>
      </div>
    </div>

    <app-outlet-selector-modal
      [isOpen]="isOutletModalOpen()"
      [stores]="stores()"
      [selectedStoreId]="selectedStore()?.id || null"
      (close)="isOutletModalOpen.set(false)"
      (selectStore)="onStoreSelected($event)"
    ></app-outlet-selector-modal>
  `
})
export class FulfillmentSelector implements OnInit {
  private storefrontData = inject(StorefrontDataService);
  
  stores = signal<Store[]>([]);
  selectedStore = signal<Store | null>(null);
  isOutletModalOpen = signal<boolean>(false);

  ngOnInit() {
    this.storefrontData.getStores().subscribe({
      next: (data) => {
        this.stores.set(data);
        if (data.length > 0 && !this.selectedStore()) {
          this.selectedStore.set(data[0]);
        }
      },
      error: (err) => console.error('Failed to fetch stores', err)
    });
  }

  openOutletModal() {
    this.isOutletModalOpen.set(true);
  }

  onStoreSelected(store: Store) {
    this.selectedStore.set(store);
    this.isOutletModalOpen.set(false);
  }
}
