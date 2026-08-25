import { Component, inject , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideUser, lucideMapPin, lucideStar, lucidePackage, lucideShieldCheck, lucideLogOut, lucideChevronRight, lucideHeart, lucideBell } from '@ng-icons/lucide';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  viewProviders: [provideIcons({ lucideUser, lucideMapPin, lucideStar, lucidePackage, lucideShieldCheck, lucideLogOut, lucideChevronRight, lucideHeart, lucideBell })],
  templateUrl: './account-sidebar.component.html'
})
export class AccountSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems = [
    { label: 'Your profile', icon: 'lucideUser', route: '/account/profile.component' },
    { label: 'Your orders', icon: 'lucidePackage', route: '/account/orders.component' },
    { label: 'Your reviews', icon: 'lucideStar', route: '/account/reviews' },
    { label: 'Wishlist', icon: 'lucideHeart', route: '/account/wishlist.component' },
    { label: 'Notifications', icon: 'lucideBell', route: '/account/notifications.component' },
  ];

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
