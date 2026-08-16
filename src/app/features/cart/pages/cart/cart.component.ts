import { MobileHeaderComponent } from '../../../../shared/components/mobile-header/mobile-header.component';
import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  CommonModule , NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideCheckCircle2, lucideShoppingBag, lucideHeart, lucideX, lucideInfo, lucideArrowLeft } from '@ng-icons/lucide';
import { CartService } from '../../../../features/cart/services/cart.service';
import { CheckoutService } from '../../../../features/checkout/services/checkout.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthModalService } from '../../../../core/services/auth-modal.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WishlistService } from '../../../../features/wishlist/services/wishlist.service';
import { StorefrontDataService } from '../../../catalog/services/catalog.service';
import { CartItem } from '../../components/cart-item/cart-item.component';
import { CartSummary } from '../../components/cart-summary/cart-summary.component';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';
import { BreadcrumbItem, BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, CartItem, CartSummary, TenantCurrencyPipe, BreadcrumbsComponent, MobileHeaderComponent, NgOptimizedImage],
  templateUrl: './cart.component.html',
  viewProviders: [provideIcons({ lucideTrash2, lucideCheckCircle2, lucideShoppingBag, lucideHeart, lucideX, lucideInfo, lucideArrowLeft })]
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private wishlistService = inject(WishlistService);
  private storefrontData = inject(StorefrontDataService);
  private destroyRef = inject(DestroyRef);

  cart$ = this.cartService.cart$;
  itemToRemove = signal<any | null>(null);
  selectedItemIds = signal<Set<string>>(new Set());
  isCheckoutStarting = signal(false);
  
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Cart' }
  ];

  ngOnInit() {
    this.cartService.loadCart();
    
    // Automatically select all items when cart loads/updates initially
    this.cart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(cart => {
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

  clearSelected() {
    const selectedIds = [...this.selectedItemIds()];
    if (selectedIds.length === 0) {
      this.toastService.error('Please select items to remove');
      return;
    }

    selectedIds.forEach(id => this.cartService.removeItem(id));
    this.selectedItemIds.set(new Set());
  }

  clearCart() {
    this.cartService.clearCart();
    this.selectedItemIds.set(new Set());
  }

  removeItem(item: any) {
    this.itemToRemove.set(item);
  }

  cancelRemove() {
    this.itemToRemove.set(null);
  }

  confirmRemove() {
    const item = this.itemToRemove();
    if (item) {
      this.cartService.removeItem(item.id);
      this.itemToRemove.set(null);
    }
  }

  moveToWishlist() {
    const item = this.itemToRemove();
    if (item) {
      this.wishlistService.addItem(item.productId);
      this.cartService.removeItem(item.id);
      this.itemToRemove.set(null);
      this.toastService.success('Item moved to wishlist');
    }
  }

  updateQuantity(itemId: string, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
  }

  startCheckout() {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        const hasCompleteDetails = user.displayName && user.phone && user.email;
        
        if (hasCompleteDetails) {
          this.isCheckoutStarting.set(true);
          this.storefrontData.prepareCheckoutDefaults().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (defaults) => {
              if (defaults && defaults.store) {
                const req = {
                  selectedOutletId: defaults.store.id,
                  pickupContactName: user.displayName!,
                  pickupContactPhone: user.phone!,
                  pickupContactEmail: user.email!,
                  requestedCollectionAt: defaults.collectionAt
                };
                this.checkoutService.createFromCart(req, undefined, { nextStep: 3 }).subscribe({
                  next: (res) => {
                    this.isCheckoutStarting.set(false);
                    if (res.success) {
                      this.checkoutService.openReviewCheckout();
                    } else {
                      this.toastService.error(res.message || 'Failed to start checkout');
                    }
                  },
                  error: (err) => {
                    console.error('Failed to create checkout session', err);
                    this.isCheckoutStarting.set(false);
                    this.toastService.error(err.error?.message || 'Failed to start checkout');
                  }
                });
              } else {
                this.isCheckoutStarting.set(false);
                this.toastService.error('Store collection is not available');
              }
            },
            error: (err) => {
              console.error('Failed to prepare checkout defaults', err);
              this.isCheckoutStarting.set(false);
              this.toastService.error('Failed to prepare checkout');
            }
          });
        } else {
          // Missing details, open fast-track checkout starting at details step
          this.checkoutService.openCheckoutWithDetails();
        }
      } else {
        this.authModalService.open('login');
      }
    });
  }
}
