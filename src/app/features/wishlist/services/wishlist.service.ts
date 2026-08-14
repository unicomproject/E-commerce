import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { WishlistReadModel, AddWishlistItemRequest } from '../../../features/wishlist/models/wishlist.models';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalService } from '../../../core/services/auth-modal.service';
import { ApiResponse } from '../../cart/services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private wishlistSubject = new BehaviorSubject<WishlistReadModel | null>(null);
  
  wishlist$ = this.wishlistSubject.asObservable();
  totalItems$: Observable<number> = this.wishlist$.pipe(
    map(wishlist => wishlist?.itemCount || 0)
  );
  
  private readonly baseUrl = `${environment.apiUrl}/ecommerce/storefront/wishlist`;

  constructor() {}

  loadWishlist(): void {
    if (!this.ensureAuthenticated(false)) {
      return;
    }

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
    if (!this.ensureAuthenticated()) {
      return;
    }

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
    if (!this.ensureAuthenticated()) {
      return;
    }

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
    if (!this.ensureAuthenticated()) {
      return;
    }

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

  clearLocalState(): void {
    this.wishlistSubject.next(null);
  }

  private ensureAuthenticated(openLogin = true): boolean {
    if (this.authService.isAuthenticated || this.authService.currentUserSnapshot) {
      return true;
    }

    this.clearLocalState();
    if (openLogin) {
      this.authModalService.open('login');
    }

    return false;
  }
}
