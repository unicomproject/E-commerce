import { Component, inject, OnInit, signal, effect, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import {  CommonModule , NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideShoppingCart, lucideHeart, lucideChevronRight, lucideChevronDown, lucideFilter, lucideArrowLeft, lucideX, lucideInfo } from '@ng-icons/lucide';
import { WishlistService } from '../../../../features/wishlist/services/wishlist.service';
import { CartService } from '../../../../features/cart/services/cart.service';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { BodyScrollLockService } from '../../../../core/services/body-scroll-lock.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, PriceComponent, StarRatingComponent, NgOptimizedImage],
  templateUrl: './wishlist.component.html',
  viewProviders: [provideIcons({ lucideShoppingCart, lucideHeart, lucideChevronRight, lucideChevronDown, lucideFilter, lucideArrowLeft, lucideX, lucideInfo })]
})
export class Wishlist implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private bodyScrollLock = inject(BodyScrollLockService);
  private destroyRef = inject(DestroyRef);

  wishlist$ = this.wishlistService.wishlist$;
  breadcrumbItems: BreadcrumbItem[] = [{ label: 'Home', link: '/' }, { label: 'My Account', link: '/account' }, { label: 'Wishlist' }];

  // Guards against an accidental heart click removing an item outright --
  // the customer confirms before it's actually taken off the wishlist.
  itemToRemove = signal<any | null>(null);

  constructor() {
    let wasOpen = false;
    effect(() => {
      const open = this.itemToRemove() !== null;
      if (open && !wasOpen) this.bodyScrollLock.lock();
      if (!open && wasOpen) this.bodyScrollLock.unlock();
      wasOpen = open;
    });
    this.destroyRef.onDestroy(() => {
      if (wasOpen) this.bodyScrollLock.unlock();
    });
  }

  ngOnInit() {
    this.wishlistService.loadWishlist();
  }

  moveToCart(item: any) {
    this.cartService.addItem({
      productId: item.productId,
      productVariantId: item.productVariantId,
      quantity: 1
    });
    this.wishlistService.removeItem(item.id);
  }

  requestRemove(item: any) {
    this.itemToRemove.set(item);
  }

  cancelRemove() {
    this.itemToRemove.set(null);
  }

  confirmRemove() {
    const item = this.itemToRemove();
    if (item) {
      this.wishlistService.removeItem(item.id);
      this.itemToRemove.set(null);
    }
  }
}
