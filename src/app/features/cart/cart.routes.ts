import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.Cart)
  }
];
