import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideCheckCircle2, lucideShoppingBag, lucideHeart, lucideX, lucideInfo, lucideArrowLeft } from '@ng-icons/lucide';
import { CartService } from '../../../../core/services/cart.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthModalService } from '../../../../core/services/auth-modal.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CartItem } from '../../components/cart-item/cart-item';
import { CartSummary } from '../../components/cart-summary/cart-summary';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, CartItem, CartSummary, TenantCurrencyPipe],
  templateUrl: './cart.html',
  viewProviders: [provideIcons({ lucideTrash2, lucideCheckCircle2, lucideShoppingBag, lucideHeart, lucideX, lucideInfo, lucideArrowLeft })]
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private wishlistService = inject(WishlistService);

  cart$ = this.cartService.cart$;
  itemToRemove = signal<any | null>(null);

  ngOnInit() {
    this.cartService.loadCart();
  }

  updateQuantity(itemId: string, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(item: any) {
    this.itemToRemove.set(item);
    document.body.style.overflow = 'hidden';
  }

  confirmRemove() {
    const item = this.itemToRemove();
    if (item) {
      this.cartService.removeItem(item.id);
      this.closeModal();
    }
  }

  cancelRemove() {
    this.closeModal();
  }

  moveToWishlist() {
    const item = this.itemToRemove();
    if (item) {
      this.wishlistService.addItem({
        productId: item.productId,
        productVariantId: item.productVariantId
      });
      this.cartService.removeItem(item.id);
      this.closeModal();
    }
  }

  private closeModal() {
    this.itemToRemove.set(null);
    document.body.style.overflow = 'auto';
  }

  startCheckout() {
    if (this.authService.isAuthenticated) {
      this.checkoutService.openCheckout();
    } else {
      this.authModalService.open('login');
    }
  }
}
