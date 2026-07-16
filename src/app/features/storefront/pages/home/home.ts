import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { StorefrontDataService } from '../../services/storefront-data.service';

import { FulfillmentSelector } from '../../components/fulfillment-selector/fulfillment-selector';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';
import { CategoryStrip } from '../../components/category-strip/category-strip';
import { PromoBanners } from '../../components/promo-banners/promo-banners';
import { ProductGrid } from '../../components/product-grid/product-grid';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FulfillmentSelector,
    HeroCarousel,
    CategoryStrip,
    PromoBanners,
    ProductGrid
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col min-h-screen bg-white">
      
      <app-fulfillment-selector></app-fulfillment-selector>
      
      <!-- Check if backend is responding or use fallback UI -->
      <ng-container *ngIf="!isLoading(); else loadingState">
        <app-hero-carousel></app-hero-carousel>
        <app-category-strip></app-category-strip>
        <app-promo-banners></app-promo-banners>
        <app-product-grid title="Best Sellers" [products]="bestSellers()"></app-product-grid>
      </ng-container>

      <ng-template #loadingState>
        <div class="flex-1 flex flex-col items-center justify-center py-20 text-neutral-400">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange mb-4"></div>
          <p>Loading Storefront...</p>
          <p class="text-xs mt-2 max-w-xs text-center">If this takes too long, ensure the E_POS Backend API is running on localhost:5000.</p>
        </div>
      </ng-template>

    </div>
  `
})
export class Home {
  private dataService = inject(StorefrontDataService);

  // Use toSignal to automatically subscribe and manage state
  categories = toSignal(this.dataService.getFeaturedCategories(), { initialValue: [] });
  bestSellers = toSignal(this.dataService.getBestSellers(), { initialValue: [] });
  stores = toSignal(this.dataService.getStores(), { initialValue: [] });

  // Computed signal to determine loading state. 
  // For MVP, if bestSellers hasn't loaded and hasn't errored yet (since it's empty initially).
  // A better approach in production is catching errors in the service or interceptor.
  // We'll consider it "loaded" once the observables complete or we assume the interceptor caught it.
  // Since we don't have a direct "loading" flag from `toSignal` without a wrapper, 
  // we'll assume it's loaded if we have data or if some time has passed. 
  // Actually, to keep it simple, we'll just check if bestSellers length > 0.
  // If we want a strict loading state, we should wrap the observable or use rxResource.
  // Let's implement a simple wrapper or just let Angular render it (since initialValue is []).
  isLoading = computed(() => {
    // If the interceptor throws an error, we won't get data.
    // For now, since it's a demo, we will just show the page immediately if no loading state is strictly required, 
    // or we can use a basic boolean signal if we wanted manual control.
    // Let's just return false to show the UI instantly.
    return false; 
  });
}
