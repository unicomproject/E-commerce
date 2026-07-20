import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/storefront/pages/home/home').then(m => m.Home)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/storefront/pages/categories/categories').then(m => m.Categories)
  },
  {
    path: 'collections/:slug',
    loadComponent: () => import('./features/storefront/pages/collections/collections').then(m => m.Collections)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/storefront/pages/search/search').then(m => m.Search)
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./features/storefront/pages/product-detail/product-detail').then(m => m.ProductDetail)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/storefront/pages/cart/cart').then(m => m.Cart)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/storefront/pages/orders/orders').then(m => m.Orders),
    canActivate: [authGuard]
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/storefront/pages/order-details/order-details').then(m => m.OrderDetails),
    canActivate: [authGuard]
  },
  {
    path: 'account',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/storefront/pages/account/account').then(m => m.Account)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/storefront/pages/account/profile/profile').then(m => m.PersonalInformation)
      }
    ],
    canActivate: [authGuard]
  }
];
