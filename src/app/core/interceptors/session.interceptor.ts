import { HttpInterceptorFn } from '@angular/common/http';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept requests going to our backend API
  if (req.url.includes('/api/v1/')) {
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('cartSessionId', sessionId);
    }

    const clonedRequest = req.clone({
      setHeaders: {
        'X-Cart-Session-Id': sessionId
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
