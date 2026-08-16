import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/account-layout/account-layout.component').then(m => m.AccountLayoutComponent),
    children: [
      {
        path: 'wishlist',
        loadComponent: () => import('../wishlist/pages/wishlist/wishlist.component').then(m => m.Wishlist)
      },
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.routes').then(m => m.routes)
      },
      {
        path: '',
        loadComponent: () => import('./pages/account.component').then(m => m.Account)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.PersonalInformation)
      },
      {
        path: 'addresses',
        loadComponent: () => import('./pages/addresses/addresses.component').then(m => m.AddressesComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.AccountNotificationsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
      {
        path: 'reviews/write/:productId',
        loadComponent: () => import('./pages/reviews/write-review/write-review.component').then(m => m.WriteReviewComponent)
      },
      {
        path: 'reviews/edit/:reviewId',
        loadComponent: () => import('./pages/reviews/write-review/write-review.component').then(m => m.WriteReviewComponent)
      }
    ]
  }
];

