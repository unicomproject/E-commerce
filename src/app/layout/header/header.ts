import { Component, HostListener, inject, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideHeart, lucideShoppingCart, lucideShoppingBag, lucideUser, lucideMenu, lucidePackage, lucideLayoutGrid, lucideTag, lucideChevronDown, lucideLogOut, lucideMapPin, lucideShieldCheck, lucideBell, lucideClock, lucideX, lucideStar } from '@ng-icons/lucide';
import { AuthModalService } from '../../core/services/auth-modal.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CategoryMegaMenu } from './category-mega-menu/category-mega-menu';
import { RecentOrdersBottomSheet } from '../../features/storefront/components/recent-orders-bottom-sheet/recent-orders-bottom-sheet';
import { ToastService } from '../../core/services/toast.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CartAnimationService } from '../../core/services/cart-animation.service';
import { SearchBarComponent } from './search-bar/search-bar';
import { NotificationPanelComponent } from '../../shared/components/notification-panel/notification-panel';
import { NotificationService } from '../../core/services/notification.service';

import { RecentOrdersModalService } from '../../core/services/recent-orders-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, CategoryMegaMenu, RecentOrdersBottomSheet, CdkDrag, SearchBarComponent, NotificationPanelComponent],
  viewProviders: [provideIcons({ lucideSearch, lucideHeart, lucideShoppingCart, lucideShoppingBag, lucideUser, lucideMenu, lucidePackage, lucideLayoutGrid, lucideTag, lucideChevronDown, lucideLogOut, lucideMapPin, lucideShieldCheck, lucideBell, lucideClock, lucideX, lucideStar })],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { class: 'sticky top-0 z-50 block w-full' }
})
export class Header implements OnInit, AfterViewInit, AfterViewChecked {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  public authModalService = inject(AuthModalService);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public toastService = inject(ToastService);
  public wishlistService = inject(WishlistService);
  public modalService = inject(RecentOrdersModalService);
  public notificationService = inject(NotificationService);
  public cartAnimationService = inject(CartAnimationService);
  @ViewChild('cartIconBtn') cartIconBtn!: ElementRef;
  @ViewChild('mobileCartIconBtn') mobileCartIconBtn!: ElementRef;
  
  private mobileCartRegistered = false;

  ngAfterViewInit() {
    if (this.cartIconBtn) {
      this.cartAnimationService.registerDesktopCart(this.cartIconBtn);
    }
  }

  ngAfterViewChecked() {
    // mobileCartIconBtn lives inside *ngIf="total > 0", so it appears dynamically
    if (this.mobileCartIconBtn && !this.mobileCartRegistered) {
      this.cartAnimationService.registerMobileCart(this.mobileCartIconBtn);
      this.mobileCartRegistered = true;
    }
  }

  openNotifications() {
    if (!this.authService.isAuthenticated) {
      this.authModalService.open('login');
      return;
    }

    this.notificationService.togglePanel();
    if (this.notificationService.panelOpen()) {
      this.notificationService.loadNotifications(1, 20).subscribe();
      this.notificationService.refreshUnreadCount().subscribe();
    }
  }
  openRecentOrders() {
    if (!this.authService.isAuthenticated && !this.authService.currentUserSnapshot) {
      this.authModalService.open('login');
      return;
    }

    this.modalService.open();
  }
  
  isScrolled = false;
  isNavbarHidden = false;
  lastScrollTop = 0;
  
  currentUser$ = this.authService.currentUser$;
  totalItems$ = this.cartService.totalItems$;
  wishlistTotalItems$ = this.wishlistService.totalItems$;

  ngOnInit() {


    this.cartService.loadCart();
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        if (user) {
          this.wishlistService.loadWishlist();
          this.notificationService.startPolling();
        } else {
          this.wishlistService.clearLocalState();
          this.notificationService.clearState();
        }
      });
  }





  openAuthModal() {
    this.authModalService.open('login');
  }

  logout() {
    this.authService.logout().subscribe();
  }

  showComingSoon(feature: string) {
    this.toastService.info(`${feature} feature is coming soon!`);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    
    // Hide navbar when scrolling down, show when scrolling up
    if (currentScroll > this.lastScrollTop && currentScroll > 60) {
      this.isNavbarHidden = true;
    } else {
      this.isNavbarHidden = false;
    }
    
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    this.isScrolled = currentScroll > 0;
  }


}
