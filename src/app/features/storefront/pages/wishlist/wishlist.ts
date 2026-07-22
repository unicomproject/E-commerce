import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideShoppingCart, lucideHeart, lucideChevronRight, lucideChevronDown, lucideFilter, lucideArrowLeft } from '@ng-icons/lucide';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CartService } from '../../../../core/services/cart.service';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, TenantCurrencyPipe],
  templateUrl: './wishlist.html',
  viewProviders: [provideIcons({ lucideTrash2, lucideShoppingCart, lucideHeart, lucideChevronRight, lucideChevronDown, lucideFilter, lucideArrowLeft })]
})
export class Wishlist implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  wishlist$ = this.wishlistService.wishlist$;

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
