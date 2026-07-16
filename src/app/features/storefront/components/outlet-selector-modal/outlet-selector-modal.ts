import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() stores: Store[] = [];
  @Input() selectedStoreId: string | null = null;
  @Input() isOpen = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() selectStore = new EventEmitter<Store>();

  closeModal() {
    this.isOpen = false;
    setTimeout(() => {
      this.close.emit();
    }, 300); // match transition duration
  }

  onSelect(store: Store) {
    this.selectedStoreId = store.id;
  }

  confirmSelection() {
    if (this.selectedStoreId) {
      const store = this.stores.find(s => s.id === this.selectedStoreId);
      if (store) {
        this.selectStore.emit(store);
      }
    }
  }

  get selectedStoreName(): string {
    if (!this.selectedStoreId) return '';
    const store = this.stores.find(s => s.id === this.selectedStoreId);
    return store ? store.name : '';
  }
}
