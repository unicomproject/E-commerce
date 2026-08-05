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
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, CartItem, CartSummary, TenantCurrencyPipe, PageHeaderComponent],
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
  selectedItemIds = signal<Set<string>>(new Set());
  
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Cart' }
  ];

  ngOnInit() {
    this.cartService.loadCart();
    
    // Automatically select all items when cart loads/updates initially
    this.cart$.subscribe(cart => {
      if (cart && cart.items.length > 0) {
        // If selection is empty, select all by default
        if (this.selectedItemIds().size === 0) {
          const allIds = new Set(cart.items.map(item => item.id));
          this.selectedItemIds.set(allIds);
        } else {
          // Clean up selected items that are no longer in cart
          const currentIds = new Set(cart.items.map(item => item.id));
          const updatedSelection = new Set([...this.selectedItemIds()].filter(id => currentIds.has(id)));
          if (updatedSelection.size !== this.selectedItemIds().size) {
            this.selectedItemIds.set(updatedSelection);
          }
        }
      } else {
        this.selectedItemIds.set(new Set());
      }
    });
  }

  toggleSelection(itemId: string) {
    const current = new Set(this.selectedItemIds());
    if (current.has(itemId)) {
      current.delete(itemId);
    } else {
      current.add(itemId);
    }
    this.selectedItemIds.set(current);
  }

  selectAll(cartItems: any[]) {
    if (this.isAllSelected(cartItems)) {
      this.selectedItemIds.set(new Set());
    } else {
      this.selectedItemIds.set(new Set(cartItems.map(item => item.id)));
    }
  }

  isAllSelected(cartItems: any[]): boolean {
    if (!cartItems || cartItems.length === 0) return false;
    return cartItems.every(item => this.selectedItemIds().has(item.id));
  }

  clearCart() {
    this.cartService.clearCart();
    this.selectedItemIds.set(new Set());
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
