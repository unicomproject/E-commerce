import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

@Component({
  selector: 'app-quantity-stepper',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './quantity-stepper.component.html',
  viewProviders: [provideIcons({ lucideMinus, lucidePlus })]
})
export class QuantityStepperComponent {
  @Input() quantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();

  increment() {
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}
