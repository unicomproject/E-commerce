import { Component, input , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantCurrencyPipe } from '../price/../../pipes/tenant-currency.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule, TenantCurrencyPipe],
  templateUrl: './price.component.html'
})
export class PriceComponent {
  readonly value = input(0);
  readonly format = input('1.2-2');
  readonly className = input('');
}