import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-quantity-stepper',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './quantity-stepper.component.html',
  viewProviders: [provideIcons({ lucideMinus, lucidePlus })],
})
export class QuantityStepperComponent {
  readonly quantity = input(1);
  readonly quantityChange = output<number>();

  increment() {
    this.quantityChange.emit(this.quantity() + 1);
  }

  decrement() {
    if (this.quantity() > 1) {
      this.quantityChange.emit(this.quantity() - 1);
    }
  }
}
