import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.Home)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.Search)
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.component').then(m => m.Categories)
  },
  {
    path: 'categories/:slug',
    loadComponent: () => import('./pages/category-detail/category-detail.component').then(m => m.CategoryDetailComponent)
  },
  {
    path: 'collections/:slug',
    loadComponent: () => import('./pages/collections/collections.component').then(m => m.Collections)
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetail)
  },
  {
    path: 'product/:slug/reviews',
    loadComponent: () => import('./pages/product-reviews-page/product-reviews-page.component').then(m => m.ProductReviewsPage)
  }
];
