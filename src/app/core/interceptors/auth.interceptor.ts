import { HttpInterceptorFn } from '@angular/common/http';
import { getValidCustomerAccessToken } from '../services/customer-auth-token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept requests going to our backend API
  if (req.url.includes('/api/v1/')) {
    const isLoginOrRefresh = req.url.includes('/ecommerce/storefront/auth/login') ||
      req.url.includes('/ecommerce/storefront/auth/refresh');
    const token = getValidCustomerAccessToken();

    let clonedRequest = req.clone({ withCredentials: true });
    if (token && !isLoginOrRefresh) {
      clonedRequest = clonedRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next(clonedRequest);
  }

  return next(req);
};
