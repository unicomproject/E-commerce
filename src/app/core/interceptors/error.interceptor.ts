import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';
import { clearCustomerAuthStorage } from '../services/customer-auth-token';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authModalService = inject(AuthModalService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        // Client side error
        errorMsg = `Client Error: ${error.error.message}`;
      } else {
        // Server side error
        errorMsg = `Server Error Code: ${error.status}, Message: ${error.message}`;
        if (error.status === 0) {
          errorMsg = 'Cannot connect to the server. Please check your internet connection or if the backend is running.';
        }
      }
      
      const isRefreshRequest = req.url.includes('/ecommerce/storefront/auth/refresh');
      const isLoginRequest = req.url.includes('/ecommerce/storefront/auth/login');
      const isGoogleAuthRequest = req.url.includes('/ecommerce/storefront/auth/google');
      const isComponentHandledAuthRequest = isLoginRequest || isGoogleAuthRequest;
      const isExpectedEmailVerificationLoginFailure = isLoginRequest &&
        error.status === 403 &&
        error.error?.errorCode === 'customer_auth.email_not_verified';
      const shouldSuppressGlobalErrorLog = isComponentHandledAuthRequest || isExpectedEmailVerificationLoginFailure;
      
      // Don't log 401 on refresh as it's expected when user is not logged in
      if (!(error.status === 401 && isRefreshRequest) && !shouldSuppressGlobalErrorLog) {
        console.error('Global Error Interceptor:', errorMsg);
        
        // Only a generic toast for 500 errors or 0 (network down) -- these are
        // the cases unlikely to have dedicated handling anywhere else. 4xx
        // business/validation failures are deliberately left to whichever
        // service or component made the call: nearly every one of them
        // already shows its own toast with a more specific message (or the
        // backend's own message via err.error?.message), and toasting here
        // too produced the same error twice on screen for the same failure.
        if (error.status === 0) {
           toastService.error('Cannot connect to the server. Please check your internet connection.');
        } else if (error.status >= 500) {
           toastService.error('Something went wrong on the server. Please try again later.');
        }
      }
      
      if (error.status === 401) {
        if (isComponentHandledAuthRequest || isRefreshRequest) {
          clearCustomerAuthStorage();
          return throwError(() => error);
        }

        const canAttemptRefresh = authService.currentUserSnapshot !== null || authService.accessToken !== null || authService.hasSessionHint;
        if (!canAttemptRefresh) {
          authService.clearLocalSession();
          authModalService.open('login');
          return throwError(() => error);
        }

        return authService.refreshSession().pipe(
          switchMap(response => {
            const token = authService.accessToken;
            if (response.success && token) {
              const retryRequest = req.clone({
                withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              return next(retryRequest);
            }

            authService.clearLocalSession();
            authModalService.open('login');
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
