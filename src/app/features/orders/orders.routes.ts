import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/orders/orders').then(m => m.Orders)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/order-details/order-details').then(m => m.OrderDetails)
  }
];
