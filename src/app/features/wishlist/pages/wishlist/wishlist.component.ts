import { Component, inject, OnInit , ChangeDetectionStrategy } from '@angular/core';
import {  CommonModule , NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideShoppingCart, lucideHeart, lucideChevronRight, lucideChevronDown, lucideFilter, lucideArrowLeft } from '@ng-icons/lucide';
import { WishlistService } from '../../../../features/wishlist/services/wishlist.service';
import { CartService } from '../../../../features/cart/services/cart.service';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, PriceComponent, StarRatingComponent, NgOptimizedImage],
  templateUrl: './wishlist.component.html',
  viewProviders: [provideIcons({ lucideTrash2, lucideShoppingCart, lucideHeart, lucideChevronRight, lucideChevronDown, lucideFilter, lucideArrowLeft })]
})
export class Wishlist implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  wishlist$ = this.wishlistService.wishlist$;
  breadcrumbItems: BreadcrumbItem[] = [{ label: 'Home', link: '/' }, { label: 'My Account', link: '/account.component' }, { label: 'Wishlist' }];

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

  removeItem(itemId: string) {
    this.wishlistService.removeItem(itemId);
  }
}
