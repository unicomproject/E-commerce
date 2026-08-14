import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart } from '@ng-icons/lucide';
import { StorefrontProductListReadModel } from '../../../core/models';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TenantCurrencyPipe } from '../../pipes/tenant-currency.pipe';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, NgIconComponent, TenantCurrencyPipe, StarRatingComponent, NgOptimizedImage],
  viewProviders: [provideIcons({ lucideHeart })],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<StorefrontProductListReadModel | any>();
  readonly layout = input<'grid' | 'list'>('grid');

  private readonly wishlistService = inject(WishlistService);
  readonly wishlistSig = toSignal(this.wishlistService.wishlist$);

  readonly isInWishlist = computed(() => {
    const list = this.wishlistSig();
    const product = this.product();
    if (!list || !product) return false;
    return list.items.some((i) => i.productId === product.id);
  });

  readonly ratingValue = computed(() => {
    const rating = Number(this.product()?.rating ?? 0);
    return Math.min(5, Math.max(0, Math.round(rating)));
  });

  readonly reviewCount = computed(() => {
    return Number(this.product()?.reviewCount ?? 0);
  });

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const product = this.product();
    if (!product) return;

    if (this.isInWishlist()) {
      const list = this.wishlistSig();
      const item = list?.items.find((i) => i.productId === product.id);
      if (item) {
        this.wishlistService.removeItem(item.id);
      }
    } else {
      this.wishlistService.addItem({ productId: product.id });
    }
  }
}
