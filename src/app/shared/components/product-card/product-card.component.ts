import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideStar, lucideShoppingBag } from '@ng-icons/lucide';
import { StorefrontProductListReadModel } from '../../../core/models';
import { WishlistService } from '../../../core/services/wishlist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TenantCurrencyPipe } from '../../pipes/tenant-currency.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, TenantCurrencyPipe],
  viewProviders: [provideIcons({ lucideHeart, lucideStar, lucideShoppingBag })],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  readonly product = input.required<StorefrontProductListReadModel | any>();
  private readonly wishlistService = inject(WishlistService);
  
  // Use toSignal to make wishlist$ reactive inside computed
  readonly wishlistSig = toSignal(this.wishlistService.wishlist$);

  readonly isInWishlist = computed(() => {
    const list = this.wishlistSig();
    const product = this.product();
    if (!list || !product) return false;
    return list.items.some(i => i.productId === product.id);
  });

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const product = this.product();
    if (!product) return;
    
    if (this.isInWishlist()) {
      const list = this.wishlistSig();
      const item = list?.items.find(i => i.productId === product.id);
      if (item) {
        this.wishlistService.removeItem(item.id);
      }
    } else {
      this.wishlistService.addItem({ productId: product.id });
    }
  }
}