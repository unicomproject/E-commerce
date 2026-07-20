import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, HttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { TenantContextService } from './core/services/tenant-context.service';
import { AuthService } from './core/services/auth.service';
import { routes } from './app.routes';
import { tenantInterceptor } from './core/interceptors/tenant.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import { sessionInterceptor } from './core/interceptors/session.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

function resolveStoreSlug(hostname: string): string {
  const defaultSlug = (environment as any).defaultTenantSlug || 'default';
  const normalizedHostname = hostname.toLowerCase();
  const isIpv4Address = /^(\d{1,3}\.){3}\d{1,3}$/.test(normalizedHostname);
  const isIpv6Address = normalizedHostname.includes(':');
  const isLocalHost = normalizedHostname === 'localhost' ||
    normalizedHostname === '127.0.0.1' ||
    normalizedHostname === '0.0.0.0';

  if (isLocalHost || isIpv4Address || isIpv6Address) {
    return defaultSlug;
  }

  const parts = normalizedHostname.split('.');
  return parts.length >= 3 ? parts[0] : defaultSlug;
}

export function initializeTenant(http: HttpClient, tenantCtx: TenantContextService, authService: AuthService) {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const slug = resolveStoreSlug(window.location.hostname);
      const url = `${environment.apiUrl}/ecommerce/storefront/tenant/resolve?slug=${slug}`;
      
      firstValueFrom(http.get<any>(url)).then(
        (res) => {
          tenantCtx.tenantId = res.tenantId;
          firstValueFrom(authService.refreshSession()).then(
            () => resolve(true),
            () => resolve(true)
          );
        },
        (err) => {
          console.error('Failed to resolve tenant:', err);
          // In production, reject to block the app from loading completely
          // or ideally redirect to a 404 page outside the Angular app context.
          document.body.innerHTML = `
            <div style="display:flex; height:100vh; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; flex-direction:column;">
              <h1 style="color:#d9381e;">Store Not Found</h1>
              <p>The store you are trying to visit does not exist or is currently inactive.</p>
            </div>
          `;
          reject(err); 
        }
      );
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })), 
    provideHttpClient(withInterceptors([tenantInterceptor, sessionInterceptor, authInterceptor, errorInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTenant,
      deps: [HttpClient, TenantContextService, AuthService],
      multi: true
    }
  ],
};

