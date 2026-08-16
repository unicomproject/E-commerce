import { Component, OnInit, inject, signal, computed , ChangeDetectionStrategy , DestroyRef, HostListener } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  CommonModule } from '@angular/common';
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
  lucideZoomIn,
  lucideChevronDown,
  lucideChevronUp,
  lucidePackage
} from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/catalog.service';
import { CartService } from '../../../../features/cart/services/cart.service';
import { WishlistService } from '../../../../features/wishlist/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CartAnimationService } from '../../../../features/cart/services/cart-animation.service';
import { StorefrontProductDetailReadModel, StorefrontProductImageReadModel, StorefrontProductVariantReadModel, ProductReviewsPageReadModel } from '../../../../core/models';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { QuantityStepperComponent } from '../../../../shared/components/quantity-stepper/quantity-stepper.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { TabsComponent, TabItem } from '../../../../shared/components/tabs/tabs.component';
import { FulfillmentSelector } from '../../../checkout/components/fulfillment-selector/fulfillment-selector.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DEMO_SNEAKER, DEMO_REVIEWS } from '../../../../core/mocks/demo-product.mock';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ProductReviewsComponent } from '../../components/product-reviews/product-reviews.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, NgIconComponent, StarRatingComponent, QuantityStepperComponent, TenantCurrencyPipe, BreadcrumbsComponent, PageHeaderComponent, ProductReviewsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
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
    lucideArrowLeft,
    lucideChevronDown,
    lucideChevronUp,
    lucideZoomIn,
    lucidePackage
  })]
})
export class ProductDetail implements OnInit {
  private destroyRef = inject(DestroyRef);
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
    const variant = this.selectedVariant();
    if (!list || !prod) return false;
    
    // Check if the specific variant is in the wishlist
    // If there is no variant selected, check if the base product is in the wishlist
    return list.items.some(i => i.productId === prod.id && i.productVariantId === (variant?.id || null));
  });
  
  // Selection Signals
  activeImageIndex = signal<number>(0);
  quantity = signal<number>(1);
  selectedOptions = signal<Record<string, string>>({});
  
  // Sticky Nav State
  activeSection = signal<string>('details');
  showStickyNav = signal<boolean>(false);
  isHeaderHidden = signal<boolean>(false);
  private lastScrollTop = 0;

  // Tabs State (Legacy, keeping for any dependencies)
  activeTabId = signal<string>('reviews');
  reviews = signal<ProductReviewsPageReadModel | null>(null);
  
  reviewSort = signal<string>('newest');
  reviewRating = signal<number | null>(null);

  tabs = computed<TabItem[]>(() => {
    const p = this.product();
    const r = this.reviews();
    const count = r ? r.summary.totalReviews : (p?.reviewCount || 0);
    return [
      { id: 'details', label: 'Product Details' },
      { id: 'specs', label: 'Specifications' },
      { id: 'returns', label: 'Delivery & Returns' },
      { id: 'reviews', label: `Reviews (${count})` }
    ];
  });

  // Computed Signals for Real-time Reactive Sync
  selectedVariant = computed<StorefrontProductVariantReadModel | null>(() => {
    const p = this.product();
    if (!p || !p.variants || p.variants.length === 0) return null;

    const currentSelection = this.selectedOptions();
    
    return p.variants.find(v => {
      // For every option defined in the product, check if the variant's optionValue matches the selected option value name
        for (const opt of (p.options || [])) {
          const selectedValueId = currentSelection[opt.optionName];
          if (!selectedValueId) return false;
          
          const selectedValue = opt.values.find(val => val.id === selectedValueId);
          if (!selectedValue) return false;
          
          const optKeys = Object.keys(v.optionValues || {});
          const optNameKey = optKeys.find(k => k.toLowerCase() === opt.optionName.toLowerCase());
          const variantOptionValueName = optNameKey ? v.optionValues![optNameKey] : undefined;
          
          if (!variantOptionValueName || 
              (variantOptionValueName.toLowerCase() !== selectedValue.name?.toLowerCase() && 
               variantOptionValueName.toLowerCase() !== selectedValue.displayName?.toLowerCase())) {
            return false;
          }
        }
      return true;
    }) || null;
  });

  currentImage = computed<StorefrontProductImageReadModel | null>(() => {
    const p = this.product();
    if (!p || !p.images || p.images.length === 0) return null;
    const idx = this.activeImageIndex();
    return p.images[idx] || p.images[0];
  });

  selectedOptionValueName(optionName: string): string {
    const p = this.product();
    const selection = this.selectedOptions();
    if (!p || !selection[optionName]) return '';
    
    const opt = p.options.find(o => o.optionName === optionName);
    if (!opt) return '';
    
    const val = opt.values.find(v => v.id === selection[optionName]);
    return val ? (val.displayName || val.name) : '';
  }

  displayPrice = computed<number>(() => {
    const variant = this.selectedVariant();
    if (variant) return variant.price;
    return this.product()?.price ?? 0;
  });

  originalPrice = computed<number | undefined>(() => {
    const variant: any = this.selectedVariant();
    if (variant && variant.originalPrice) return variant.originalPrice;
    return (this.product() as any)?.originalPrice;
  });

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const p = this.product();
    if (!p) return [{ label: 'Home', link: '/' }];
    
    const items: BreadcrumbItem[] = [
      { label: 'Home', link: '/' }
    ];

    if (p.categoryName) {
       items.push({ label: p.categoryName, link: p.categorySlug ? `/collections/${p.categorySlug}` : undefined });
    }
    
    if (p.subCategoryName) {
       items.push({ label: p.subCategoryName, link: p.subCategorySlug ? `/collections/${p.subCategorySlug}` : undefined });
    }

    items.push({ label: p.name || 'Product Details' });
    return items;
  });

  isCurrentlyInStock = computed<boolean>(() => {
    const p = this.product();
    if (!p) return false;
    
    if ((p.options && p.options.length > 0) || (p.variants && p.variants.length > 0)) {
      const variant = this.selectedVariant();
      return variant ? variant.isInStock : false;
    }
    
    return p.isInStock ?? true;
  });

  currentSku = computed<string>(() => {
    const variant = this.selectedVariant();
    if (variant?.sku) return variant.sku;
    return this.product()?.variants?.[0]?.sku ?? 'N/A';
  });

  canAddToCart = computed<boolean>(() => {
    const p = this.product();
    if (!p) return false;
    
    if (this.displayPrice() <= 0) return false;
    
    if (p.options && p.options.length > 0) {
      const currentSelection = this.selectedOptions();
      for (const opt of p.options) {
        if (!currentSelection[opt.optionName]) return false;
      }
    }
    
    if ((p.options && p.options.length > 0) || (p.variants && p.variants.length > 0)) {
      const variant = this.selectedVariant();
      if (!variant) return false;
    }
    
    return this.isCurrentlyInStock();
  });

  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
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

    source$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.activeImageIndex.set(0);

        // Auto-select base variant (first variant's options)
        const initialSelections: Record<string, string> = {};
        if (prod.options && prod.options.length > 0) {
          if (prod.variants && prod.variants.length > 0) {
            const baseVariant = prod.variants[0];
              for (const opt of prod.options) {
                const optKeys = Object.keys(baseVariant.optionValues || {});
                const optNameKey = optKeys.find(k => k.toLowerCase() === opt.optionName.toLowerCase());
                const variantOptValueName = optNameKey ? baseVariant.optionValues![optNameKey] : undefined;
                
                if (variantOptValueName) {
                  const match = opt.values.find(v => 
                    v.name?.toLowerCase() === variantOptValueName.toLowerCase() || 
                    v.displayName?.toLowerCase() === variantOptValueName.toLowerCase()
                  );
                  if (match) {
                    initialSelections[opt.optionName] = match.id;
                  } else if (opt.values.length > 0) {
                    initialSelections[opt.optionName] = opt.values[0].id;
                  }
                } else if (opt.values.length > 0) {
                  initialSelections[opt.optionName] = opt.values[0].id;
                }
              }
          } else {
            for (const opt of prod.options) {
              if (opt.values.length > 0) {
                initialSelections[opt.optionName] = opt.values[0].id;
              }
            }
          }
        }
        this.selectedOptions.set(initialSelections);
        
        this.loading.set(false);
        this.loadReviews(prod.id);
      },
      error: (err) => {
        console.error('Error fetching product details', err);
        this.loading.set(false);
      }
    });
  }

  loadReviews(productId: string) {
    if (this.slug === 'demo-sneaker') {
      this.reviews.set(DEMO_REVIEWS);
      return;
    }

    this.dataService.getProductReviews(
      productId, 
      1, 
      10, 
      this.reviewSort(), 
      this.reviewRating()
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (reviewsPage) => {
        this.reviews.set(reviewsPage);
      },
      error: (err) => {
        console.error('Error fetching product reviews', err);
      }
    });
  }

  onReviewFilterChange(filter: { sort: string, rating: number | null }) {
    this.reviewSort.set(filter.sort);
    this.reviewRating.set(filter.rating);
    
    const p = this.product();
    if (p) {
      this.loadReviews(p.id);
    }
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

  selectOption(optionName: string, valueId: string) {
    this.selectedOptions.update(opts => ({
      ...opts,
      [optionName]: valueId
    }));
    
    // Check if the option is color, to update the image
    const isColor = optionName.toLowerCase().includes('color') || optionName.toLowerCase().includes('colour');
    if (isColor) {
      const p = this.product();
      if (p?.images?.length) {
        const opt = p.options.find(o => o.optionName === optionName);
        if (opt) {
          const val = opt.values.find(v => v.id === valueId);
          if (val?.imageUrl) {
            const imgIdx = p.images.findIndex(img => img.url === val.imageUrl);
            if (imgIdx !== -1) {
              this.activeImageIndex.set(imgIdx);
            }
          }
        }
      }
    }
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
      const variant = this.selectedVariant();
      const item = list?.items.find(i => i.productId === p.id && i.productVariantId === (variant?.id || null));
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

  // Sticky ScrollSpy Logic
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    // Show sticky nav only after scrolling down 300px
    if (currentScroll > 300) {
      this.showStickyNav.set(true);
    } else {
      this.showStickyNav.set(false);
    }

    // Sync header hidden state with page-header component logic
    this.isHeaderHidden.set(currentScroll > this.lastScrollTop && currentScroll > 60);
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

    const sections = ['details', 'reviews', 'specs'];
    let current = 'details';
    
    // Exact threshold calculation
    const headerOffset = this.isHeaderHidden() ? 48 : 104;
    const threshold = headerOffset + 60; // Allow 60px leeway when scrolling past the nav bar
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= threshold) {
          current = section;
        }
      }
    }
    this.activeSection.set(current);
  }

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update active state immediately for snappier UI feel
      this.activeSection.set(sectionId);
    }
  }

  getNavLinkClass(section: string): string {
    const base = 'flex-1 h-full flex justify-center items-center px-1 whitespace-nowrap transition-colors border-b-2 ';
    if (this.activeSection() === section) {
      return base + 'border-brand-orange text-brand-orange font-bold';
    }
    return base + 'border-transparent text-gray-500 hover:text-gray-900';
  }
}
