import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EligibleReviewsPageReadModel, CustomerReviewsPageReadModel } from '../models';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerReviewsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/ecommerce/storefront/account/reviews`;

  getCustomerReviews(page = 1, pageSize = 10, sort = 'newest'): Observable<CustomerReviewsPageReadModel> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sort', sort);

    return this.http.get<ApiResponse<CustomerReviewsPageReadModel>>(this.baseUrl, { 
      params,
      withCredentials: true 
    }).pipe(map(response => response.data));
  }

  getEligibleReviews(page = 1, pageSize = 10): Observable<EligibleReviewsPageReadModel> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<EligibleReviewsPageReadModel>>(`${this.baseUrl}/eligible`, { 
      params,
      withCredentials: true 
    }).pipe(map(response => response.data));
  }

  createReview(productId: string, request: { ratingValue: number; reviewTitle?: string; reviewText?: string; isRecommended?: boolean }): Observable<any> {
    const url = `${environment.apiUrl}/ecommerce/storefront/catalog/products/${productId}/reviews`;
    return this.http.post<ApiResponse<any>>(url, request, {
      withCredentials: true
    }).pipe(map(response => response.data));
  }

  updateReview(reviewId: string, request: { ratingValue: number; reviewTitle?: string; reviewText?: string; isRecommended?: boolean }): Observable<any> {
    const url = `${environment.apiUrl}/ecommerce/storefront/reviews/${reviewId}`;
    return this.http.patch<ApiResponse<any>>(url, request, {
      withCredentials: true
    }).pipe(map(response => response.data));
  }
}
