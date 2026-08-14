import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Product, Category, Banner, Store, StorefrontSearchReadModel, StorefrontSearchRequest, StorefrontProductDetailReadModel, ProductReviewsPageReadModel } from '../../../core/models';

export interface CollectionWindow {
  startAt: string;
  endAt: string;
}

export interface CollectionDate {
  date: string;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  windows: CollectionWindow[];
}

export interface CollectionOptions {
  outletId: string;
  outletName: string;
  timezone: string;
  preparationLeadMinutes: number;
  pickupWindowMinutes: number;
  cutoffTime: string | null;
  generatedAt: string;
  earliestCollectionAt: string;
  dates: CollectionDate[];
}

export interface CheckoutDefaults {
  store: Store;
  collectionAt: string;
}

@Injectable({ providedIn: 'root' })
export class StorefrontDataService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/ecommerce/storefront`;

  // Global State for Checkout Optimization
  availableStores = signal<Store[]>([]);
  selectedStore = signal<Store | null>(null);
  requestedCollectionAt = signal<string | null>(null);
  selectedTimeText = signal<string>('As soon as possible');

  getHeroBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.baseUrl}/banners?bannerType=Hero`);
  }

  getPromoBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.baseUrl}/banners?bannerType=Promo`);
  }

  getRootCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/catalog/categories`);
  }

  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/catalog/categories/by-slug/${slug}`);
  }

  getChildCategories(categoryId: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/catalog/categories/${categoryId}/children`);
  }

  getFeaturedCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/catalog/categories/featured`);
  }

  getBestSellers(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/catalog/products/best-sellers`);
  }

  getProducts(categoryId: string): Observable<import('../../../core/models').StorefrontPagedReadModel<import('../../../core/models').StorefrontProductListReadModel>> {
    return this.http.get<import('../../../core/models').StorefrontPagedReadModel<import('../../../core/models').StorefrontProductListReadModel>>(`${this.baseUrl}/catalog/products?categoryId=${categoryId}`);
  }

  getProductDetail(slug: string): Observable<StorefrontProductDetailReadModel> {
    return this.http.get<StorefrontProductDetailReadModel>(`${this.baseUrl}/catalog/products/${slug}`);
  }

  getProductReviews(productId: string, page = 1, pageSize = 10, sort = 'newest', rating: number | null = null): Observable<ProductReviewsPageReadModel> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sort', sort);

    if (rating !== null) {
      params = params.set('rating', rating.toString());
    }

    return this.http.get<{ data: ProductReviewsPageReadModel }>(`${this.baseUrl}/catalog/products/${productId}/reviews`, { params })
      .pipe(map(response => response.data));
  }

  searchProducts(request: StorefrontSearchRequest): Observable<StorefrontSearchReadModel> {
    let params = new HttpParams();
    Object.keys(request).forEach(key => {
      const val = (request as any)[key];
      if (val !== null && val !== undefined && val !== '') {
        params = params.set(key, val.toString());
      }
    });
    return this.http.get<StorefrontSearchReadModel>(`${this.baseUrl}/catalog/search`, { params });
  }

  autocompleteSearch(query: string, limit: number = 10): Observable<StorefrontSearchReadModel> {
    const params = new HttpParams().set('q', query).set('limit', limit.toString());
    return this.http.get<StorefrontSearchReadModel>(`${this.baseUrl}/catalog/autocomplete`, { params });
  }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}/fulfillment/stores`).pipe(
      map(stores => stores.map((s, index) => ({
        ...s,
        imageUrl: index === 0
          ? 'https://images.unsplash.com/photo-1555529733-0e670560f4e1?w=400&h=300&fit=crop'
          : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
        statusText: index === 3 ? 'Busy' : 'Open',
        closingTime: `Closes ${9 + index}:00 PM`,
        isRecommended: index === 0
      })))
    );
  }

  getCollectionOptions(outletId: string, days: number = 5): Observable<CollectionOptions> {
    return this.http.get<CollectionOptions>(`${this.baseUrl}/fulfillment/stores/${outletId}/collection-options?days=${days}`);
  }

  /**
   * First bookable pickup window start (aligned to outlet windows).
   * Do not use raw earliestCollectionAt alone — checkout rejects non-window times.
   */
  resolveEarliestBookableSlot(opts: CollectionOptions | null | undefined): string | null {
    if (!opts?.dates?.length) return null;
    for (const date of opts.dates) {
      const start = date.windows?.[0]?.startAt;
      if (start) return start;
    }
    return null;
  }

  /**
   * Resolve store + collection time for checkout from API (no hardcoded times).
   * ASAP / empty time → first available collection window.
   */
  prepareCheckoutDefaults(): Observable<CheckoutDefaults | null> {
    return this.getStores().pipe(
      switchMap(stores => {
        let store = this.selectedStore();
        if (!store && stores.length > 0) {
          store = stores[0];
          this.selectedStore.set(store);
        }
        if (!store?.id) {
          return of(null);
        }

        const isAsap =
          !this.requestedCollectionAt() ||
          this.selectedTimeText() === 'As soon as possible';

        if (!isAsap && this.requestedCollectionAt()) {
          return of({ store, collectionAt: this.requestedCollectionAt()! });
        }

        // Look ahead enough days in case today is past cutoff / no remaining windows
        return this.getCollectionOptions(store.id, 7).pipe(
          map(opts => {
            const collectionAt = this.resolveEarliestBookableSlot(opts);
            if (!collectionAt) return null;

            this.requestedCollectionAt.set(collectionAt);
            this.selectedTimeText.set('As soon as possible');
            return { store, collectionAt };
          }),
          catchError(() => of(null))
        );
      }),
      catchError(() => of(null))
    );
  }
}
