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
    path: 'reset-password',
    loadComponent: () => import('./features/account/pages/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },

  {
    path: 'account',
    loadComponent: () => import('./features/storefront/pages/account-layout/account-layout.component').then(m => m.AccountLayoutComponent),
    children: [
      {
        path: 'wishlist',
        loadComponent: () => import('./features/storefront/pages/wishlist/wishlist').then(m => m.Wishlist)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/storefront/pages/orders/orders').then(m => m.Orders)
      },

      {
        path: 'orders/:id',
        loadComponent: () => import('./features/storefront/pages/order-details/order-details').then(m => m.OrderDetails)
      },
      {
        path: '',
        loadComponent: () => import('./features/storefront/pages/account/account').then(m => m.Account)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/storefront/pages/account/profile/profile').then(m => m.PersonalInformation)
      },
      {
        path: 'addresses',
        loadComponent: () => import('./features/storefront/pages/account/addresses/addresses').then(m => m.AddressesComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/storefront/pages/account/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
      {
        path: 'reviews/write/:productId',
        loadComponent: () => import('./features/storefront/pages/account/reviews/write-review/write-review.component').then(m => m.WriteReviewComponent)
      },
      {
        path: 'reviews/edit/:reviewId',
        loadComponent: () => import('./features/storefront/pages/account/reviews/write-review/write-review.component').then(m => m.WriteReviewComponent)
      }
    ],
    canActivate: [authGuard]
  }
];
