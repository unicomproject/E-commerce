import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideHeart, lucideShoppingCart, lucideShoppingBag, lucideUser, lucideMenu, lucidePackage, lucideLayoutGrid, lucideTag, lucideChevronDown, lucideLogOut, lucideMapPin, lucideShieldCheck, lucideBell } from '@ng-icons/lucide';
import { AuthModalService } from '../../core/services/auth-modal.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CategoryMegaMenu } from './category-mega-menu/category-mega-menu';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, CategoryMegaMenu],
  viewProviders: [provideIcons({ lucideSearch, lucideHeart, lucideShoppingCart, lucideShoppingBag, lucideUser, lucideMenu, lucidePackage, lucideLayoutGrid, lucideTag, lucideChevronDown, lucideLogOut, lucideMapPin, lucideShieldCheck, lucideBell })],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { class: 'sticky top-0 z-50 block w-full' }
})
export class Header implements OnInit {
  private router = inject(Router);
  public authModalService = inject(AuthModalService);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public toastService = inject(ToastService);
  
  isScrolled = false;
  isNavbarHidden = false;
  lastScrollTop = 0;
  searchQuery = '';
  currentUser$ = this.authService.currentUser$;
  totalItems$ = this.cartService.totalItems$;

  ngOnInit() {
    this.cartService.loadCart();
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

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
}
