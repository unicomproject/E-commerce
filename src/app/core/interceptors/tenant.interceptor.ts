import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantContextService } from '../services/tenant-context.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantCtx = inject(TenantContextService);
  
  // Only intercept requests going to our backend API
  if (req.url.includes('/api/v1/')) {
    // If tenant id is available, attach it. 
    // We wrap it in a try-catch because TenantContextService throws if tenantId is accessed before initialization.
    try {
      const tenantId = tenantCtx.tenantId;
      if (tenantId) {
        const clonedRequest = req.clone({
          setHeaders: {
            'X-Tenant-Id': tenantId
          }
        });
        return next(clonedRequest);
      }
    } catch (e) {
      // Ignore if tenantId is not resolved yet (e.g. during tenant/resolve API call itself)
    }
  }

  return next(req);
};
