import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then(m => m.Search)
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories').then(m => m.Categories)
  },
  {
    path: 'categories/:slug',
    loadComponent: () => import('./pages/category-detail/category-detail').then(m => m.CategoryDetailComponent)
  },
  {
    path: 'collections/:slug',
    loadComponent: () => import('./pages/collections/collections').then(m => m.Collections)
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail)
  }
];
