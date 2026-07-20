import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Product, Category, Banner, Store, StorefrontSearchReadModel, StorefrontSearchRequest, StorefrontProductDetailReadModel } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class StorefrontDataService {
  private http = inject(HttpClient);
  
  private baseUrl = `${environment.apiUrl}/ecommerce/storefront`; 

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

  searchProducts(request: StorefrontSearchRequest): Observable<StorefrontSearchReadModel> {
    // Clean up empty params
    let params = new HttpParams();
    Object.keys(request).forEach(key => {
      const val = (request as any)[key];
      if (val !== null && val !== undefined && val !== '') {
        params = params.set(key, val.toString());
      }
    });
    return this.http.get<StorefrontSearchReadModel>(`${this.baseUrl}/catalog/search`, { params });
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
}
