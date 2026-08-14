import { Component, computed, input, linkedSignal, output , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  lucideX, 
  lucideSearch, 
  lucideTarget, 
  lucideMapPin, 
  lucideCheckCircle2, 
  lucideCar, 
  lucideShoppingBag, 
  lucideParkingCircle, 
  lucideInfo,
  lucideCircle
} from '@ng-icons/lucide';
import { Store } from '../../../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-outlet-selector-modal',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ 
    lucideX, 
    lucideSearch, 
    lucideTarget, 
    lucideMapPin, 
    lucideCheckCircle2, 
    lucideCar, 
    lucideShoppingBag, 
    lucideParkingCircle, 
    lucideInfo,
    lucideCircle
  })],
  templateUrl: './outlet-selector-modal.html'
})
export class OutletSelectorModalComponent {
  readonly stores = input<Store[]>([]);
  readonly selectedStoreId = input<string | null>(null);
  readonly isOpen = input(false);
  
  readonly close = output<void>();
  readonly selectStore = output<Store>();

  readonly visible = linkedSignal(() => this.isOpen());
  readonly selectedStoreIdState = linkedSignal(() => this.selectedStoreId());
  readonly selectedStoreName = computed(() => {
    const selectedStoreId = this.selectedStoreIdState();
    if (!selectedStoreId) return '';
    return this.stores().find(s => s.id === selectedStoreId)?.name ?? '';
  });

  closeModal() {
    this.visible.set(false);
    setTimeout(() => {
      this.close.emit();
    }, 300); // match transition duration
  }

  onSelect(store: Store) {
    this.selectedStoreIdState.set(store.id);
  }

  confirmSelection() {
    const selectedStoreId = this.selectedStoreIdState();
    if (!selectedStoreId) return;

    const store = this.stores().find(s => s.id === selectedStoreId);
    if (store) {
      this.selectStore.emit(store);
    }
  }
}