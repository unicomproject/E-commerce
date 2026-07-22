import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantCurrencyPipe } from '../price/../../pipes/tenant-currency.pipe';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule, TenantCurrencyPipe],
  template: `
    <span [ngClass]="className">
      {{ value | tenantCurrency:'symbol':format }}
    </span>
  `
})
export class PriceComponent {
  @Input() value: number = 0;
  @Input() format: string = '1.2-2';
  @Input() className: string = '';
}
