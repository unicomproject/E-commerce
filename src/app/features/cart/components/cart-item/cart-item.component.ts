import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { LazyMediaImageComponent } from '../../../../shared/components/lazy-media-image/lazy-media-image.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, PriceComponent, LazyMediaImageComponent],
  templateUrl: './cart-item.component.html'
})
export class CartItem {
  item = input.required<any>();
  isSelected = input<boolean>(false);
  
  onRemove = output<any>();
  onUpdateQuantity = output<{itemId: string, quantity: number}>();
  onToggleSelect = output<string>();

  removeItem() {
    this.onRemove.emit(this.item());
  }

  increment() {
    this.onUpdateQuantity.emit({ itemId: this.item().id, quantity: this.item().quantity + 1 });
  }

  decrement() {
    if (this.item().quantity > 1) {
      this.onUpdateQuantity.emit({ itemId: this.item().id, quantity: this.item().quantity - 1 });
    }
  }
}
