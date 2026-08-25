import { Component, input, computed, inject, ChangeDetectionStrategy, LOCALE_ID } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { TenantContextService } from '../../../core/services/tenant-context.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price.component.html'
})
export class PriceComponent {
  private tenantCtx = inject(TenantContextService);
  private locale = inject(LOCALE_ID);

  readonly value = input<number | string | null | undefined>(0);
  readonly format = input('1.2-2');
  readonly className = input('');

  currencyCode = computed(() => this.tenantCtx.currencyCode);

  integerPart = computed(() => {
    const val = this.value();
    if (val == null) return '0';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '0';
    
    const formatted = formatNumber(num, this.locale, this.format());
    const parts = formatted.split('.');
    return parts[0];
  });

  decimalPart = computed(() => {
    const val = this.value();
    if (val == null) return '00';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '00';
    
    const formatted = formatNumber(num, this.locale, this.format());
    const parts = formatted.split('.');
    return parts.length > 1 ? parts[1] : '00';
  });
}