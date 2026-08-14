import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/account-layout/account-layout.component').then(m => m.AccountLayoutComponent),
    children: [
      {
        path: 'wishlist',
        loadComponent: () => import('../wishlist/pages/wishlist/wishlist').then(m => m.Wishlist)
      },
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.routes').then(m => m.routes)
      },
      {
        path: '',
        loadComponent: () => import('./pages/account/account').then(m => m.Account)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/account/profile/profile').then(m => m.PersonalInformation)
      },
      {
        path: 'addresses',
        loadComponent: () => import('./pages/account/addresses/addresses').then(m => m.AddressesComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/account/notifications/notifications').then(m => m.AccountNotificationsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/account/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
      {
        path: 'reviews/write/:productId',
        loadComponent: () => import('./pages/account/reviews/write-review/write-review.component').then(m => m.WriteReviewComponent)
      },
      {
        path: 'reviews/edit/:reviewId',
        loadComponent: () => import('./pages/account/reviews/write-review/write-review.component').then(m => m.WriteReviewComponent)
      }
    ]
  }
];
