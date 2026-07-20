import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authModalService = inject(AuthModalService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }
      
      // Open the login modal and redirect to home
      authModalService.open('login');
      return router.createUrlTree(['/']);
    })
  );
};
