import { Component, inject, OnInit, OnDestroy , ChangeDetectionStrategy } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerLoginCustomerDto } from '../../../core/models';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItem } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { MobileHeaderComponent } from '../../../shared/components/mobile-header/mobile-header.component';
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
  lucideHeart,
  lucideArrowLeft
} from '@ng-icons/lucide';

interface QuickAction {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  isDestructive?: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, NgIconComponent, MobileHeaderComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
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
    lucideHeart,
    lucideArrowLeft
  })]
})
export class Account implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
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
    { label: 'Sign Out', icon: 'lucideLogOut', action: () => this.logout(), isDestructive: true },
  ];

  ngOnInit() {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.user = user;
    });
    
    // Redirect to profile on desktop since /account is mobile-only dashboard
    this.checkDesktopRedirect();
    window.addEventListener('resize', this.onResize);
  }
  
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
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
