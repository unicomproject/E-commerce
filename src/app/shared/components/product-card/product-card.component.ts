import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart } from '@ng-icons/lucide';
import { StorefrontProductListReadModel } from '../../../core/models';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PriceComponent } from '../price/price.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { LazyMediaImageComponent } from '../lazy-media-image/lazy-media-image.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, NgIconComponent, PriceComponent, StarRatingComponent, LazyMediaImageComponent],
  viewProviders: [provideIcons({ lucideHeart })],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<StorefrontProductListReadModel | any>();
  readonly layout = input<'grid' | 'list'>('grid');
  readonly isPriority = input<boolean>(false);

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

  readonly discountPercentage = computed(() => {
    const p = this.product();
    if (p && p.originalPrice && p.originalPrice > p.price) {
      return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    }
    return null;
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
