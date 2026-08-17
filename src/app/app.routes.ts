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
    path: 'account',
    loadChildren: () => import('./features/customer/customer.routes').then(m => m.routes),
    canActivate: [authGuard]
  }
];

