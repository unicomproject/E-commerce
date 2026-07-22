import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantContextService {
  private _tenantId: string | null = null;
  private _currencyCode: string = 'USD'; // Default fallback

  get tenantId(): string {
    if (!this._tenantId) {
      throw new Error('Tenant ID has not been resolved yet.');
    }
    return this._tenantId;
  }

  set tenantId(id: string) {
    this._tenantId = id;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  set currencyCode(code: string) {
    if (code) {
      this._currencyCode = code;
    }
  }
}
