import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUser, lucideMapPin, lucideStar, lucidePackage, lucideShieldCheck, lucideLogOut, lucideChevronRight, lucideHeart, lucideBell } from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  viewProviders: [provideIcons({ lucideUser, lucideMapPin, lucideStar, lucidePackage, lucideShieldCheck, lucideLogOut, lucideChevronRight, lucideHeart, lucideBell })],
  templateUrl: './account-sidebar.component.html'
})
export class AccountSidebarComponent {
  private authService = inject(AuthService);

  menuItems = [
    { label: 'Your orders', icon: 'lucidePackage', route: '/account/orders' },

    { label: 'Your profile', icon: 'lucideUser', route: '/account/profile' },
    { label: 'Addresses', icon: 'lucideMapPin', route: '/account/addresses' },
    { label: 'Your reviews', icon: 'lucideStar', route: '/account/reviews' },
    { label: 'Wishlist', icon: 'lucideHeart', route: '/account/wishlist' }
  ];

  logout() {
    this.authService.logout();
  }
}
