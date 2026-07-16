import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorefrontCartReadModel, AddStorefrontCartItemRequest, UpdateStorefrontCartItemRequest } from '../models/cart.model';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private cartSubject = new BehaviorSubject<StorefrontCartReadModel | null>(null);
  
  cart$ = this.cartSubject.asObservable();
  
  private readonly baseUrl = `${environment.apiUrl}/ecommerce/storefront/cart`;

  constructor() {}

  loadCart(): void {
    this.http.get<ApiResponse<StorefrontCartReadModel>>(this.baseUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      },
      error: (err) => {
        // If 404, it just means no active cart yet for this session.
        if (err.status === 404) {
          this.cartSubject.next(null);
        } else {
          console.error('Failed to load cart', err);
        }
      }
    });
  }

  addItem(request: AddStorefrontCartItemRequest): void {
    this.http.post<ApiResponse<StorefrontCartReadModel>>(`${this.baseUrl}/items`, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      },
      error: (err) => console.error('Failed to add item to cart', err)
    });
  }

  updateQuantity(itemId: string, quantity: number): void {
    const request: UpdateStorefrontCartItemRequest = { quantity };
    this.http.patch<ApiResponse<StorefrontCartReadModel>>(`${this.baseUrl}/items/${itemId}`, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      },
      error: (err) => console.error('Failed to update cart item', err)
    });
  }

  removeItem(itemId: string): void {
    this.http.delete<ApiResponse<StorefrontCartReadModel>>(`${this.baseUrl}/items/${itemId}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      },
      error: (err) => console.error('Failed to remove cart item', err)
    });
  }

  clearCart(): void {
    this.http.delete<ApiResponse<StorefrontCartReadModel>>(this.baseUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartSubject.next(response.data);
        }
      },
      error: (err) => console.error('Failed to clear cart', err)
    });
  }
}
