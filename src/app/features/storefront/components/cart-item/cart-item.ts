import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';
import { QuantityStepperComponent } from '../../../../shared/components/quantity-stepper/quantity-stepper.component';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, NgIconComponent, QuantityStepperComponent, TenantCurrencyPipe],
  templateUrl: './cart-item.html',
  viewProviders: [provideIcons({ lucideTrash2 })]
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

  updateQuantity(quantity: number) {
    this.onUpdateQuantity.emit({ itemId: this.item().id, quantity });
  }
}
