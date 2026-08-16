import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { StorefrontDataService } from '../../services/catalog.service';

import { FulfillmentSelector } from '../../../checkout/components/fulfillment-selector/fulfillment-selector.component';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel.component';
import { CategoryStrip } from '../../components/category-strip/category-strip.component';
import { PromoBanners } from '../../components/promo-banners/promo-banners.component';
import { ProductGrid } from '../../components/product-grid/product-grid.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home',
  imports: [
    FulfillmentSelector,
    HeroCarousel,
    CategoryStrip,
    PromoBanners,
    ProductGrid,
    LoadingSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-page-bg lg:min-h-[calc(100vh-3.5rem)]"
    >
      @if (!isLoading()) {
        <!-- Shared horizontal padding: collection bar + banner share same vertical edges -->
        <div
          class="flex w-full max-w-[1600px] mx-auto min-w-0 flex-1 flex-col px-4 pt-2 lg:gap-6 lg:px-6 lg:px-8 lg:pt-4 lg:pb-8"
        >
          <app-fulfillment-selector class="shrink-0"></app-fulfillment-selector>
          <app-hero-carousel
            class="block w-full min-w-0 shrink-0"
            [banners]="heroBanners()"
          ></app-hero-carousel>
          <div
            class="flex w-full min-w-0 flex-col gap-4 xl:grid xl:grid-cols-2 xl:items-start xl:gap-6"
          >
            <app-category-strip
              class="block w-full min-w-0"
              [categories]="categories()"
            ></app-category-strip>
            <app-promo-banners
              class="block w-full min-w-0"
              [banners]="promoBanners()"
            ></app-promo-banners>
          </div>
          <app-product-grid
            class="block w-full min-w-0"
            title="Best Sellers"
            [products]="bestSellers()"
          ></app-product-grid>
        </div>
      } @else {
        <app-loading-spinner
          message="Loading Storefront... If this takes too long, ensure the E_POS Backend API is running on localhost:5000."
        ></app-loading-spinner>
      }
    </div>
  `,
})
export class Home {
  private dataService = inject(StorefrontDataService);

  categories = toSignal(this.dataService.getFeaturedCategories(), { initialValue: [] });
  bestSellers = toSignal(this.dataService.getBestSellers(), { initialValue: [] });
  stores = toSignal(this.dataService.getStores(), { initialValue: [] });
  heroBanners = toSignal(this.dataService.getHeroBanners(), { initialValue: [] });
  promoBanners = toSignal(this.dataService.getPromoBanners(), { initialValue: [] });

  isLoading = computed(() => false);
}
