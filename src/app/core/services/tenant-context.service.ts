import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantContextService {
  private _tenantId: string | null = null;

  get tenantId(): string {
    if (!this._tenantId) {
      throw new Error('Tenant ID has not been resolved yet.');
    }
    return this._tenantId;
  }

  set tenantId(id: string) {
    this._tenantId = id;
  }
}
