import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/catalog/catalog.routes').then(m => m.routes)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then(m => m.routes)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/account/pages/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'account',
    loadChildren: () => import('./features/account/account.routes').then(m => m.routes),
    canActivate: [authGuard]
  }
];
