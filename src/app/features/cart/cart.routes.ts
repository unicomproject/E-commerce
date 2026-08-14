import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cart/cart').then(m => m.Cart)
  }
];
