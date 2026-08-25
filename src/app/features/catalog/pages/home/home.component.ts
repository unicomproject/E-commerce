import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorefrontDataService } from '../../services/catalog.service';
import { FulfillmentSelector } from '../../../checkout/components/fulfillment-selector/fulfillment-selector.component';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel.component';
import { CategoryStrip } from '../../components/category-strip/category-strip.component';
import { PromoBanners } from '../../components/promo-banners/promo-banners.component';
import { ProductGrid } from '../../components/product-grid/product-grid.component';
import { Banner } from '../../models/banner.model';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  imports: [
    FulfillmentSelector,
    HeroCarousel,
    CategoryStrip,
    PromoBanners,
    ProductGrid,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-page-bg lg:min-h-[calc(100vh-3.5rem)]"
    >
      @if (!isLoading()) {
        <div
          class="flex w-full max-w-[1600px] mx-auto min-w-0 flex-1 flex-col px-4 pt-2 pb-28 sm:pb-32 lg:gap-6 lg:px-6 lg:px-8 lg:pt-4 lg:pb-8"
        >
          <app-fulfillment-selector class="shrink-0"></app-fulfillment-selector>
          <app-hero-carousel
            class="block w-full min-w-0 shrink-0"
            [banners]="heroBanners()"
          ></app-hero-carousel>
          <div
            class="flex w-full min-w-0 flex-col gap-2 md:gap-4 xl:grid xl:grid-cols-2 xl:items-start xl:gap-6"
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
        <div
          class="flex w-full max-w-[1600px] mx-auto min-w-0 flex-1 flex-col px-4 pt-2 pb-28 sm:pb-32 lg:gap-6 lg:px-6 lg:px-8 lg:pt-4 lg:pb-8"
        >
          <div class="h-[56px] w-full rounded-xl media-skeleton"></div>
          <div class="h-[180px] w-full rounded-2xl media-skeleton md:h-[320px] lg:h-[300px]"></div>
          <div class="flex w-full min-w-0 flex-col gap-4 xl:grid xl:grid-cols-2 xl:items-start xl:gap-6">
            <div>
              <div class="mb-4 mt-2 h-6 w-40 rounded media-skeleton lg:mt-0"></div>
              <div class="grid grid-cols-5 gap-1 px-1 md:flex md:gap-4">
                @for (item of [1, 2, 3, 4, 5]; track item) {
                  <div class="flex flex-col items-center">
                    <div class="aspect-square w-full max-w-[64px] rounded-full media-skeleton md:h-[90px] md:w-[90px] md:max-w-none lg:h-[96px] lg:w-[96px]"></div>
                    <div class="mt-2 h-3 w-12 rounded media-skeleton"></div>
                  </div>
                }
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
              <div class="h-[130px] rounded-xl media-skeleton md:h-[180px] lg:h-[190px]"></div>
              <div class="h-[130px] rounded-xl media-skeleton md:h-[180px] lg:h-[190px]"></div>
            </div>
          </div>
          <div class="pb-4 lg:pb-0">
            <div class="mb-4 mt-6 flex items-center justify-between lg:mt-0">
              <div class="h-6 w-36 rounded media-skeleton"></div>
              <div class="h-4 w-16 rounded media-skeleton"></div>
            </div>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              @for (card of [1, 2, 3, 4]; track card) {
                <div class="overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
                  <div class="h-[160px] w-full media-skeleton lg:h-[180px]"></div>
                  <div class="space-y-2 p-3">
                    <div class="h-4 w-4/5 rounded media-skeleton"></div>
                    <div class="h-4 w-1/3 rounded media-skeleton"></div>
                    <div class="h-3 w-1/2 rounded media-skeleton"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class Home {
  private dataService = inject(StorefrontDataService);

  private readonly home = toSignal(
    forkJoin({
      categories: this.dataService.getFeaturedCategories().pipe(catchError(() => of([] as Category[]))),
      bestSellers: this.dataService.getBestSellers().pipe(catchError(() => of([] as Product[]))),
      heroBanners: this.dataService.getHeroBanners().pipe(catchError(() => of([] as Banner[]))),
      promoBanners: this.dataService.getPromoBanners().pipe(catchError(() => of([] as Banner[]))),
    }),
    { initialValue: null }
  );

  readonly isLoading = computed(() => this.home() === null);
  readonly categories = computed(() => this.home()?.categories ?? []);
  readonly bestSellers = computed(() => this.home()?.bestSellers ?? []);
  readonly heroBanners = computed(() => this.home()?.heroBanners ?? []);
  readonly promoBanners = computed(() => this.home()?.promoBanners ?? []);
}
