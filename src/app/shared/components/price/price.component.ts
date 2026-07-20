import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="className">
      {{ value | currency: currencyCode : 'symbol' : format }}
    </span>
  `
})
export class PriceComponent {
  @Input() value: number = 0;
  @Input() currencyCode: string = 'USD';
  @Input() format: string = '1.2-2';
  @Input() className: string = '';
}
