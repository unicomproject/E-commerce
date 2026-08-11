import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
export class Account implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: CustomerLoginCustomerDto | null = null;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'My Account' }
  ];

  quickActions: QuickAction[] = [
    { label: 'Your profile', icon: 'lucideUser', route: '/account/profile' },
    { label: 'Your orders', icon: 'lucidePackage', route: '/account/orders' },
    { label: 'Your reviews', icon: 'lucideStar', route: '/account/reviews' },
    { label: 'Wishlist', icon: 'lucideHeart', route: '/account/wishlist' },
    { label: 'Notifications', icon: 'lucideBell', route: '/account/notifications' },
    { label: 'Addresses', icon: 'lucideMapPin', route: '/account/addresses' },
    { label: 'Sign Out', icon: 'lucideLogOut', action: () => this.logout(), isDestructive: true },
  ];

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    
    // Redirect to profile on desktop since /account is mobile-only dashboard
    this.checkDesktopRedirect();
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private onResize() {
    this.checkDesktopRedirect();
  }

  private checkDesktopRedirect() {
    if (window.innerWidth >= 1024) {
      this.router.navigate(['/account/profile'], { replaceUrl: true });
    }
  }
  
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
