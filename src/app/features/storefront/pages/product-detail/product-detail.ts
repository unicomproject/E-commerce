import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  lucideStar
} from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { CartService } from '../../../../core/services/cart.service';
import { StorefrontProductDetailReadModel, StorefrontProductImageReadModel, StorefrontProductOptionValueReadModel } from '../../../../core/models';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { QuantityStepperComponent } from '../../../../shared/components/quantity-stepper/quantity-stepper.component';
import { TabsComponent, TabItem } from '../../../../shared/components/tabs/tabs.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, StarRatingComponent, QuantityStepperComponent, TabsComponent],
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
    lucideStar
  })]
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(StorefrontDataService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  product: StorefrontProductDetailReadModel | null = null;
  loading = true;
  slug = '';
  
  // State
  activeImageIndex = 0;
  quantity = 1;
  selectedColorId: string | null = null;
  selectedSizeId: string | null = null;
  activeTab = 'overview';
  productTabs: TabItem[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      if (this.slug) {
        this.loadProduct();
      }
    });
  }

  loadProduct() {
    this.loading = true;
    this.dataService.getProductDetail(this.slug).subscribe({
      next: (product) => {
        this.product = product;
        this.activeImageIndex = 0;
        this.productTabs = [
          { id: 'overview', label: 'Overview' },
          { id: 'details', label: 'Details' },
          { id: 'returns', label: 'Returns & Refunds' },
          { id: 'reviews', label: 'Reviews', count: product.reviewCount }
        ];
        
        // Auto-select first available color/size if needed, for now we just leave null
        if (product.colours?.length > 0) {
          this.selectedColorId = product.colours[0].id;
        }
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product details', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helpers
  get currentImage(): StorefrontProductImageReadModel | null {
    if (!this.product || !this.product.images || this.product.images.length === 0) return null;
    return this.product.images[this.activeImageIndex] || this.product.images[0];
  }

  get selectedColorName(): string {
    if (!this.product || !this.selectedColorId) return '';
    const col = this.product.colours.find(c => c.id === this.selectedColorId);
    return col ? col.displayName || col.name : '';
  }

  get displayPrice(): number {
    if (!this.product) return 0;
    
    // Find matching variant if size/color are selected
    if (this.product.variants?.length > 0) {
      const selectedColorName = this.selectedColorId 
        ? this.product.colours?.find(c => c.id === this.selectedColorId)?.name 
        : undefined;
      const selectedSizeName = this.selectedSizeId 
        ? this.product.sizes?.find(s => s.id === this.selectedSizeId)?.name 
        : undefined;
        
      const match = this.product.variants.find(v => {
        let colorMatch = true;
        let sizeMatch = true;
        
        if (selectedColorName) {
          colorMatch = v.colour === selectedColorName;
        }
        if (selectedSizeName) {
          sizeMatch = v.size === selectedSizeName;
        }
        
        return colorMatch && sizeMatch;
      });
      
      if (match) {
        return match.price;
      }
    }
    
    return this.product.price;
  }

  // Actions
  nextImage() {
    if (!this.product?.images) return;
    this.activeImageIndex = (this.activeImageIndex + 1) % this.product.images.length;
  }

  prevImage() {
    if (!this.product?.images) return;
    this.activeImageIndex = (this.activeImageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  setImage(index: number) {
    this.activeImageIndex = index;
  }

  selectColor(id: string) {
    this.selectedColorId = id;
  }

  selectSize(id: string) {
    this.selectedSizeId = id;
  }

  get canAddToCart(): boolean {
    if (!this.product) return false;
    if (this.product.colours?.length > 0 && !this.selectedColorId) return false;
    if (this.product.sizes?.length > 0 && !this.selectedSizeId) return false;
    return true;
  }

  addToCart() {
    if (!this.product || !this.canAddToCart) return;

    let variantId: string | undefined = undefined;
    
    // Simple variant matching logic based on selected color and size names
    if (this.product.variants?.length > 0) {
      const selectedColorName = this.selectedColorId 
        ? this.product.colours?.find(c => c.id === this.selectedColorId)?.name 
        : undefined;
      const selectedSizeName = this.selectedSizeId 
        ? this.product.sizes?.find(s => s.id === this.selectedSizeId)?.name 
        : undefined;
        
      const match = this.product.variants.find(v => {
        let colorMatch = true;
        let sizeMatch = true;
        
        if (selectedColorName) {
          colorMatch = v.colour === selectedColorName;
        }
        if (selectedSizeName) {
          sizeMatch = v.size === selectedSizeName;
        }
        
        return colorMatch && sizeMatch;
      });
      
      if (match) {
        variantId = match.id;
      }
    }

    this.cartService.addItem({
      productId: this.product.id,
      productVariantId: variantId,
      quantity: this.quantity
    });
    
    // Optional: Show success toast or navigate to cart here
  }
}
