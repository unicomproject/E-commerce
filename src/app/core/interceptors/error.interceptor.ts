import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
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
      
      // In a production app, we would use a ToastrService or Snackbar here instead of console.error
      console.error('Global Error Interceptor:', errorMsg);
      
      return throwError(() => error);
    })
  );
};
