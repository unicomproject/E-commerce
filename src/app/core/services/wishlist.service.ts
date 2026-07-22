import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { WishlistReadModel, AddWishlistItemRequest } from '../models/wishlist.models';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';
import { ApiResponse } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private wishlistSubject = new BehaviorSubject<WishlistReadModel | null>(null);
  
  wishlist$ = this.wishlistSubject.asObservable();
  totalItems$: Observable<number> = this.wishlist$.pipe(
    map(wishlist => wishlist?.itemCount || 0)
  );
  
  private readonly baseUrl = `${environment.apiUrl}/ecommerce/storefront/wishlist`;

  constructor() {}

  loadWishlist(): void {
    this.http.get<ApiResponse<WishlistReadModel>>(this.baseUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.wishlistSubject.next(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading wishlist', err);
      }
    });
  }

  addItem(request: AddWishlistItemRequest): void {
    this.http.post<ApiResponse<WishlistReadModel>>(`${this.baseUrl}/items`, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.wishlistSubject.next(response.data);
          this.toastService.success(response.message || 'Item added to wishlist');
        }
      },
      error: (err) => {
        console.error('Error adding item to wishlist', err);
        this.toastService.error('Failed to add item to wishlist');
      }
    });
  }

  removeItem(itemId: string): void {
    this.http.delete<ApiResponse<WishlistReadModel>>(`${this.baseUrl}/items/${itemId}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.wishlistSubject.next(response.data);
          this.toastService.success(response.message || 'Item removed from wishlist');
        }
      },
      error: (err) => {
        console.error('Error removing item from wishlist', err);
        this.toastService.error('Failed to remove item from wishlist');
      }
    });
  }

  clearWishlist(): void {
    this.http.delete<ApiResponse<WishlistReadModel>>(this.baseUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.wishlistSubject.next(response.data);
          this.toastService.success(response.message || 'Wishlist cleared');
        }
      },
      error: (err) => {
        console.error('Error clearing wishlist', err);
        this.toastService.error('Failed to clear wishlist');
      }
    });
  }
}
