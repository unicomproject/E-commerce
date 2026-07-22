import { Component, Input, inject, computed } from '@angular/core';
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
  @Input() product!: StorefrontProductListReadModel | any;
  private wishlistService = inject(WishlistService);
  
  // Use toSignal to make wishlist$ reactive inside computed
  wishlistSig = toSignal(this.wishlistService.wishlist$);

  isInWishlist = computed(() => {
    const list = this.wishlistSig();
    if (!list) return false;
    return list.items.some(i => i.productId === this.product.id);
  });

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.isInWishlist()) {
      const list = this.wishlistSig();
      const item = list?.items.find(i => i.productId === this.product.id);
      if (item) {
        this.wishlistService.removeItem(item.id);
      }
    } else {
      this.wishlistService.addItem({ productId: this.product.id });
    }
  }
}
