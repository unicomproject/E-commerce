import { Injectable } from '@angular/core';
import { darkenHexColor, isValidHexColor, lightenHexColor } from '../utils/color.util';

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

  private _storeName: string | null = null;
  private _logoUrl: string | null = null;

  get storeName(): string | null {
    return this._storeName;
  }

  set storeName(name: string | null) {
    this._storeName = name;
  }

  get logoUrl(): string | null {
    return this._logoUrl;
  }

  set logoUrl(url: string | null) {
    this._logoUrl = url;
  }

  private _primaryColor: string | null = null;
  private _secondaryColor: string | null = null;

  get primaryColor(): string | null {
    return this._primaryColor;
  }

  get secondaryColor(): string | null {
    return this._secondaryColor;
  }

  /**
   * Applies a tenant's configured brand colors as CSS custom properties on
   * the document root. The whole app's Tailwind utilities (bg-brand-orange,
   * text-brand-orange, etc.) are defined in styles.css as @theme variables
   * that resolve to var(--color-brand-orange) etc. at runtime, so overriding
   * those variables here recolors the entire app with no rebuild needed.
   * Falls back silently (keeps the default theme) for missing/invalid hex
   * values, e.g. a tenant that hasn't customized their branding yet.
   */
  applyBrandColors(primaryColor?: string | null, secondaryColor?: string | null): void {
    const root = document.documentElement.style;

    if (isValidHexColor(primaryColor)) {
      this._primaryColor = primaryColor;
      root.setProperty('--color-brand-orange', primaryColor);
      const light = lightenHexColor(primaryColor);
      const dark = darkenHexColor(primaryColor);
      if (light) root.setProperty('--color-brand-orange-light', light);
      if (dark) root.setProperty('--color-brand-orange-dark', dark);
    }

    if (isValidHexColor(secondaryColor)) {
      this._secondaryColor = secondaryColor;
      root.setProperty('--color-brand-black', secondaryColor);
    }
  }
}
