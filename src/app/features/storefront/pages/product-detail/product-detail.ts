import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  lucideHeart, 
  lucideChevronLeft, 
  lucideChevronRight, 
  lucideCheck, 
  lucideMapPin, 
  lucideShoppingCart, 
  lucideRuler, 
  lucideShieldCheck, 
  lucideTruck, 
  lucideStore, 
  lucideRotateCcw,
  lucideStar,
  lucideArrowLeft,
  lucideZoomIn
} from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CartAnimationService } from '../../../../core/services/cart-animation.service';
import { StorefrontProductDetailReadModel, StorefrontProductImageReadModel, StorefrontProductVariantReadModel } from '../../../../core/models';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { QuantityStepperComponent } from '../../../../shared/components/quantity-stepper/quantity-stepper.component';
import { TabsComponent, TabItem } from '../../../../shared/components/tabs/tabs.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FulfillmentSelector } from '../../components/fulfillment-selector/fulfillment-selector';
import { toSignal } from '@angular/core/rxjs-interop';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DEMO_SNEAKER } from '../../../../core/mocks/demo-product.mock';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, NgIconComponent, StarRatingComponent, QuantityStepperComponent, TabsComponent, TenantCurrencyPipe, PageHeaderComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  viewProviders: [provideIcons({ 
    lucideHeart, 
    lucideChevronLeft, 
    lucideChevronRight, 
    lucideCheck, 
    lucideMapPin, 
    lucideShoppingCart,
    lucideRuler,
    lucideShieldCheck,
    lucideTruck,
    lucideStore,
    lucideRotateCcw,
    lucideStar,
    lucideArrowLeft
  })]
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(StorefrontDataService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private cartAnimationService = inject(CartAnimationService);
  private toastService = inject(ToastService);

  // Core State Signals
  product = signal<StorefrontProductDetailReadModel | null>(null);
  loading = signal<boolean>(true);
  slug = '';
  
  // Wishlist Signal
  wishlistSig = toSignal(this.wishlistService.wishlist$);
  
  isInWishlist = computed(() => {
    const list = this.wishlistSig();
    const prod = this.product();
    if (!list || !prod) return false;
    // For products with variants, we might want to check the specific variant, but usually wishlist is per product or per selected variant
    // For now we check if any variant or the product itself is in the wishlist
    return list.items.some(i => i.productId === prod.id);
  });
  
  // Selection Signals
  activeImageIndex = signal<number>(0);
  quantity = signal<number>(1);
  selectedColorId = signal<string | null>(null);
  selectedSizeId = signal<string | null>(null);
  activeTab = signal<string>('overview');
  productTabs = signal<TabItem[]>([]);

  // Computed Signals for Real-time Reactive Sync
  selectedVariant = computed<StorefrontProductVariantReadModel | null>(() => {
    const p = this.product();
    if (!p || !p.variants || p.variants.length === 0) return null;

    const colorId = this.selectedColorId();
    const sizeId = this.selectedSizeId();

    const selectedColorName = colorId 
      ? p.colours?.find(c => c.id === colorId)?.name 
      : undefined;
    const selectedSizeName = sizeId 
      ? p.sizes?.find(s => s.id === sizeId)?.name 
      : undefined;

    return p.variants.find(v => {
      let colorMatch = true;
      let sizeMatch = true;
      if (selectedColorName) {
        colorMatch = v.colour === selectedColorName || v.colour === colorId;
      }
      if (selectedSizeName) {
        sizeMatch = v.size === selectedSizeName || v.size === sizeId;
      }
      return colorMatch && sizeMatch;
    }) || null;
  });

  currentImage = computed<StorefrontProductImageReadModel | null>(() => {
    const p = this.product();
    if (!p || !p.images || p.images.length === 0) return null;
    const idx = this.activeImageIndex();
    return p.images[idx] || p.images[0];
  });

  selectedColorName = computed<string>(() => {
    const p = this.product();
    const colorId = this.selectedColorId();
    if (!p || !colorId) return '';
    const col = p.colours.find(c => c.id === colorId);
    return col ? col.displayName || col.name : '';
  });

  selectedSizeName = computed<string>(() => {
    const p = this.product();
    const sizeId = this.selectedSizeId();
    if (!p || !sizeId) return '';
    const size = p.sizes.find(s => s.id === sizeId);
    return size ? size.displayName || size.name : '';
  });

  displayPrice = computed<number>(() => {
    const variant = this.selectedVariant();
    if (variant) return variant.price;
    return this.product()?.price ?? 0;
  });

  isCurrentlyInStock = computed<boolean>(() => {
    const variant = this.selectedVariant();
    if (variant) return variant.isInStock;
    return this.product()?.isInStock ?? true;
  });

  currentSku = computed<string>(() => {
    const variant = this.selectedVariant();
    if (variant?.sku) return variant.sku;
    return this.product()?.variants?.[0]?.sku ?? 'N/A';
  });

  canAddToCart = computed<boolean>(() => {
    const p = this.product();
    if (!p) return false;
    if (p.colours?.length > 0 && !this.selectedColorId()) return false;
    if (p.sizes?.length > 0 && !this.selectedSizeId()) return false;
    return this.isCurrentlyInStock();
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      if (this.slug) {
        this.loadProduct();
      }
    });
  }

  loadProduct() {
    this.loading.set(true);

    const source$ = this.slug === 'demo-sneaker' 
      ? of(DEMO_SNEAKER).pipe(delay(400))
      : this.dataService.getProductDetail(this.slug);

    source$.subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.activeImageIndex.set(0);
        this.productTabs.set([
          { id: 'overview', label: 'Overview' },
          { id: 'details', label: 'Details' },
          { id: 'returns', label: 'Returns & Refunds' },
          { id: 'reviews', label: 'Reviews', count: prod.reviewCount }
        ]);

        // Auto-select base variant (first variant's color & size)
        if (prod.variants?.length > 0) {
          const baseVariant = prod.variants[0];
          
          if (prod.colours?.length > 0) {
            const colMatch = prod.colours.find(c => 
              c.id === baseVariant.colour || c.name === baseVariant.colour || c.displayName === baseVariant.colour);
            this.selectedColorId.set(colMatch ? colMatch.id : prod.colours[0].id);
          }

          if (prod.sizes?.length > 0) {
            const sizeMatch = prod.sizes.find(s => 
              s.id === baseVariant.size || s.name === baseVariant.size || s.displayName === baseVariant.size);
            this.selectedSizeId.set(sizeMatch ? sizeMatch.id : prod.sizes[0].id);
          }
        } else {
          if (prod.colours?.length > 0) {
            this.selectedColorId.set(prod.colours[0].id);
          }
          if (prod.sizes?.length > 0) {
            this.selectedSizeId.set(prod.sizes[0].id);
          }
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching product details', err);
        this.loading.set(false);
      }
    });
  }

  // Actions
  nextImage() {
    const images = this.product()?.images;
    if (!images || images.length === 0) return;
    this.activeImageIndex.update(idx => (idx + 1) % images.length);
  }

  prevImage() {
    const images = this.product()?.images;
    if (!images || images.length === 0) return;
    this.activeImageIndex.update(idx => (idx - 1 + images.length) % images.length);
  }

  setImage(index: number) {
    this.activeImageIndex.set(index);
  }

  selectColor(id: string) {
    this.selectedColorId.set(id);
    const p = this.product();
    if (p?.images?.length) {
      const col = p.colours.find(c => c.id === id);
      if (col?.imageUrl) {
        const imgIdx = p.images.findIndex(img => img.url === col.imageUrl);
        if (imgIdx !== -1) {
          this.activeImageIndex.set(imgIdx);
        }
      }
    }
  }

  selectSize(id: string) {
    this.selectedSizeId.set(id);
  }

  onQuantityChange(newQty: number) {
    this.quantity.set(newQty);
  }

  addToCart(event: MouseEvent) {
    const p = this.product();
    if (!p || !this.canAddToCart()) return;

    const variant = this.selectedVariant();
    
    this.cartService.addItem({
      productId: p.id,
      productVariantId: variant?.id,
      quantity: this.quantity()
    });

    const img = this.currentImage();
    if (img) {
      this.cartAnimationService.animateToCart(event, img.url);
    } else {
      this.toastService.success('Added to cart');
    }
  }

  buyNow(event: MouseEvent) {
    this.addToCart(event);
    this.router.navigate(['/cart']);
  }

  toggleWishlist() {
    const p = this.product();
    if (!p) return;

    if (this.isInWishlist()) {
      const list = this.wishlistSig();
      const item = list?.items.find(i => i.productId === p.id);
      if (item) {
        this.wishlistService.removeItem(item.id);
      }
    } else {
      const variant = this.selectedVariant();
      this.wishlistService.addItem({ 
        productId: p.id,
        productVariantId: variant?.id
      });
    }
  }
}
