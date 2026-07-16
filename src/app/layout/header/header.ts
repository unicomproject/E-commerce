import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideHeart, lucideShoppingCart, lucideUser, lucideMenu } from '@ng-icons/lucide';
import { AuthModalService } from '../../core/services/auth-modal.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink],
  viewProviders: [provideIcons({ lucideSearch, lucideHeart, lucideShoppingCart, lucideUser, lucideMenu })],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { class: 'sticky top-0 z-50 block w-full' }
})
export class Header implements OnInit {
  private router = inject(Router);
  public authModalService = inject(AuthModalService);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  
  isScrolled = false;
  searchQuery = '';
  currentUser$ = this.authService.currentUser$;
  cart$ = this.cartService.cart$;

  ngOnInit() {
    this.cartService.loadCart();
  }

  openAuthModal() {
    this.authModalService.open('login');
  }

  logout() {
    this.authService.logout().subscribe();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
}
