import { Component, inject, OnInit, signal , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideStore, lucideClock, lucideChevronDown } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../../catalog/services/catalog.service';
import { Store } from '../../../../core/models';
import { OutletSelectorModalComponent } from '../outlet-selector-modal/outlet-selector-modal.component';
import { CollectionTimeModalComponent } from '../collection-time-modal/collection-time-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-fulfillment-selector',
  standalone: true,
  imports: [CommonModule, NgIcon, OutletSelectorModalComponent, CollectionTimeModalComponent],
  viewProviders: [provideIcons({ lucideStore, lucideClock, lucideChevronDown })],
  template: `
    <div class="relative z-40 w-full bg-white pb-2">
      <div class="flex h-[56px] w-full items-center gap-3 rounded-xl border border-neutral-200 px-4">

          <!-- Store Selector -->
          <button
            type="button"
            (click)="stores().length > 1 ? openOutletModal() : null"
            class="flex min-w-0 flex-1 items-center gap-2 text-left transition-all duration-300 sm:gap-3"
            [ngClass]="{'cursor-pointer': stores().length > 1, 'cursor-default': stores().length <= 1}"
          >
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
                <ng-icon name="lucideStore" style="color: #f97316" class="text-[14px] leading-none flex-shrink-0"></ng-icon>
                Collect from
              </span>
              <span class="mt-0.5 text-[13px] sm:text-[14px] font-bold text-brand-black leading-tight">{{ selectedStore()?.name || 'Etihad Stadium Store' }}</span>
            </span>
            <ng-icon
              name="lucideChevronDown"
              class="shrink-0 text-sm leading-none text-brand-black ml-auto"
              [class.invisible]="stores().length <= 1"
            ></ng-icon>
          </button>

          <div class="h-8 w-px shrink-0 self-center bg-neutral-200"></div>

          <!-- Time Selector -->
          <button
            type="button"
            (click)="openTimeModal()"
            class="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left transition-all duration-300 sm:gap-3"
          >
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
                <ng-icon name="lucideClock" style="color: #f97316" class="text-[14px] leading-none flex-shrink-0"></ng-icon>
                Collection
              </span>
              <span class="mt-0.5 text-[13px] sm:text-[14px] font-bold text-brand-black leading-tight">{{ selectedTimeText() }}</span>
            </span>
            <ng-icon name="lucideChevronDown" class="shrink-0 text-sm leading-none text-brand-black ml-auto"></ng-icon>
          </button>

        </div>
    </div>

    <app-outlet-selector-modal
      [isOpen]="isOutletModalOpen()"
      [stores]="stores()"
      [selectedStoreId]="selectedStore()?.id || null"
      (close)="isOutletModalOpen.set(false)"
      (selectStore)="onStoreSelected($event)"
    ></app-outlet-selector-modal>

    <app-collection-time-modal
      [isOpen]="isTimeModalOpen()"
      [outletId]="selectedStore()?.id || null"
      (close)="isTimeModalOpen.set(false)"
      (confirm)="onTimeConfirmed($event)"
    ></app-collection-time-modal>
  `
})
export class FulfillmentSelector implements OnInit {
  private storefrontData = inject(StorefrontDataService);
  
  stores = this.storefrontData.availableStores;
  isOutletModalOpen = signal<boolean>(false);
  isTimeModalOpen = signal<boolean>(false);

  // Expose global state to template
  selectedStore = this.storefrontData.selectedStore;
  selectedTimeText = this.storefrontData.selectedTimeText;

  ngOnInit() {
    this.storefrontData.getStores().subscribe({
      next: (data) => {
        this.storefrontData.availableStores.set(data);
        if (data.length > 0 && !this.selectedStore()) {
          this.storefrontData.selectedStore.set(data[0]);
          this.setDefaultTimeForStore(data[0].id);
        }
      },
      error: (err) => console.error('Failed to fetch stores', err)
    });
  }

  openOutletModal() {
    this.isOutletModalOpen.set(true);
  }

  openTimeModal() {
    if (this.selectedStore()?.id) {
      this.isTimeModalOpen.set(true);
    }
  }

  onStoreSelected(store: Store) {
    this.storefrontData.selectedStore.set(store);
    this.isOutletModalOpen.set(false);
    this.setDefaultTimeForStore(store.id);
  }

  private setDefaultTimeForStore(storeId: string) {
    this.storefrontData.getCollectionOptions(storeId, 7).subscribe(opts => {
      const slot = this.storefrontData.resolveEarliestBookableSlot(opts);
      if (slot) {
        this.storefrontData.requestedCollectionAt.set(slot);
        this.storefrontData.selectedTimeText.set('As soon as possible');
      }
    });
  }

  onTimeConfirmed(selection: { type: 'asap' | 'later', date?: string, time?: string, isoString?: string }) {
    if (selection.type === 'asap') {
      this.storefrontData.selectedTimeText.set('As soon as possible');
      this.storefrontData.requestedCollectionAt.set(selection.isoString || null);
    } else if (selection.type === 'later') {
      const dateStr = selection.date === 'Today' ? 'Today' : selection.date;
      this.storefrontData.selectedTimeText.set(`${selection.time}, ${dateStr}`);
      this.storefrontData.requestedCollectionAt.set(selection.isoString || null);
    }
    this.isTimeModalOpen.set(false);
  }
}
