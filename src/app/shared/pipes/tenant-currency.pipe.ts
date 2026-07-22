import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TenantContextService } from '../../core/services/tenant-context.service';

@Pipe({
  name: 'tenantCurrency',
  standalone: true,
  pure: false // Ensure it updates if currency changes dynamically
})
export class TenantCurrencyPipe implements PipeTransform {
  private tenantCtx = inject(TenantContextService);
  private locale = inject(LOCALE_ID);
  
  private currencyPipe = new CurrencyPipe(this.locale);

  transform(
    value: number | string | null | undefined,
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo?: string,
    locale?: string
  ): string | null {
    if (value == null) return null;
    
    const currencyCode = this.tenantCtx.currencyCode;
    
    // Use 'symbol-narrow' by default if 'symbol' is requested to ensure we get 
    // recognizable symbols (like 'Rs.' or '$') instead of ISO codes (like 'LKR' or 'USD')
    const displayFormat = display === 'symbol' ? 'symbol-narrow' : display;

    return this.currencyPipe.transform(value, currencyCode, displayFormat, digitsInfo, locale);
  }
}
