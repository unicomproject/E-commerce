import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantCurrencyPipe } from '../price/../../pipes/tenant-currency.pipe';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule, TenantCurrencyPipe],
  template: `
    <span [ngClass]="className()">
      {{ value() | tenantCurrency:'symbol':format() }}
    </span>
  `
})
export class PriceComponent {
  readonly value = input(0);
  readonly format = input('1.2-2');
  readonly className = input('');
}