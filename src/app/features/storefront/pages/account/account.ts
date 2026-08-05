import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerLoginCustomerDto } from '../../../../core/models';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { 
  lucideUser, 
  lucideMail, 
  lucidePhone, 
  lucidePackage, 
  lucideChevronRight,
  lucideMapPin,
  lucideShoppingBag,
  lucideBell,
  lucideSettings,
  lucideLock,
  lucideHelpCircle,
  lucideLogOut,
  lucideHeadphones,
  lucideStar,
  lucideHeart
} from '@ng-icons/lucide';

interface QuickAction {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, PageHeaderComponent],
  templateUrl: './account.html',
  styleUrl: './account.css',
  viewProviders: [provideIcons({ 
    lucideUser, 
    lucideMail, 
    lucidePhone, 
    lucidePackage, 
    lucideChevronRight,
    lucideMapPin,
    lucideShoppingBag,
    lucideBell,
    lucideSettings,
    lucideLock,
    lucideHelpCircle,
    lucideLogOut,
    lucideHeadphones,
    lucideStar,
    lucideHeart
  })]
})
export class Account implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: CustomerLoginCustomerDto | null = null;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'My Account' }
  ];

  quickActions: QuickAction[] = [
    { label: 'Your orders', icon: 'lucidePackage', route: '/account/orders' },

    { label: 'Your profile', icon: 'lucideUser', route: '/account/profile' },
    { label: 'Addresses', icon: 'lucideMapPin', route: '/account/addresses' },
    { label: 'Your reviews', icon: 'lucideStar', route: '/account/reviews' },
    { label: 'Wishlist', icon: 'lucideHeart', route: '/account/wishlist' },
    { label: 'Sign Out', icon: 'lucideLogOut', action: () => this.logout(), isDestructive: true },
  ];

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
  
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
