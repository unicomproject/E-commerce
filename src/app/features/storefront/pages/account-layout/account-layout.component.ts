import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { AccountSidebarComponent } from '../../components/account-sidebar/account-sidebar.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AccountSidebarComponent, BreadcrumbsComponent],
  template: `
    <div class="bg-page-bg min-h-[80vh] pb-12 lg:pt-6">
      <div class="w-full max-w-[1600px] mx-auto px-4 lg:px-6 lg:px-8">
        
        <!-- Breadcrumb placed above the sidebar and main content -->
        <div class="mb-4 lg:mb-6 hidden lg:block">
          <app-breadcrumbs [items]="breadcrumbItems()"></app-breadcrumbs>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 items-start">
          
          <!-- Desktop Sidebar (Hidden on Mobile) -->
          <div class="hidden lg:block w-[300px] flex-shrink-0" *ngIf="!isRootAccountPage()">
            <app-account-sidebar></app-account-sidebar>
          </div>
          <div class="hidden lg:block w-[300px] flex-shrink-0" *ngIf="isRootAccountPage()">
            <app-account-sidebar></app-account-sidebar>
          </div>

          <!-- Main Content Area -->
          <div class="flex-grow w-full">
            <router-outlet></router-outlet>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class AccountLayoutComponent {
  private router = inject(Router);
  
  currentUrl = signal<string>(this.router.url);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  isRootAccountPage = computed(() => {
    return this.currentUrl() === '/account';
  });

  breadcrumbItems = computed(() => {
    const url = this.currentUrl();
    const items: BreadcrumbItem[] = [
      { label: 'Home', link: '/' },
      { label: 'Account', link: '/account/profile' }
    ];
    
    if (url.includes('/account/orders')) {
      items.push({ label: 'Your Orders' });

    } else if (url.includes('/account/profile')) {
      items.push({ label: 'Profile' });
    } else if (url.includes('/account/addresses')) {
      items.push({ label: 'Addresses' });
    } else if (url.includes('/account/reviews')) {
      if (url.includes('/write')) {
        items.push({ label: 'Your Reviews', link: '/account/reviews' });
        items.push({ label: 'Write Review' });
      } else {
        items.push({ label: 'Your Reviews' });
      }
    } else if (url.includes('/account/wishlist')) {
      items.push({ label: 'Wishlist' });
    }

    return items;
  });
}
