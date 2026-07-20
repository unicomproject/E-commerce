import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, shareReplay, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';
import { ToastService } from './toast.service';
import { 
  StorefrontCheckoutReadModel,
  StorefrontCollectionOptionsReadModel,
  StorefrontStoreReadModel,
  CreateStorefrontCheckoutFromCartRequest,
  UpdateStorefrontCheckoutCollectionRequest
} from '../models/checkout.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private baseUrl = `${environment.apiUrl}/ecommerce/storefront`;

  // State
  isOpen = signal<boolean>(false);
  currentStep = signal<1 | 2 | 3 | 4>(1);
  sessionId = signal<string | null>(null);
  checkoutSession = signal<StorefrontCheckoutReadModel | null>(null);
  availableStores = signal<StorefrontStoreReadModel[]>([]);
  collectionOptions = signal<StorefrontCollectionOptionsReadModel | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Events
  private stepChangedSource = new Subject<number>();
  stepChanged$ = this.stepChangedSource.asObservable();

  constructor() {}

  openCheckout() {
    this.isOpen.set(true);
    this.currentStep.set(1);
    this.error.set(null);
  }

  closeCheckout() {
    this.isOpen.set(false);
  }

  setStep(step: 1 | 2 | 3 | 4) {
    this.currentStep.set(step);
    this.stepChangedSource.next(step);
  }

  // API Calls
  createFromCart(request: CreateStorefrontCheckoutFromCartRequest, cartSessionId?: string): Observable<{ success: boolean, data?: StorefrontCheckoutReadModel, message?: string }> {
    this.isLoading.set(true);
    this.error.set(null);
    const options = cartSessionId
      ? { headers: { 'X-Cart-Session-Id': cartSessionId } }
      : undefined;

    return this.http.post<{ success: boolean, data: StorefrontCheckoutReadModel, message: string }>(
      `${this.baseUrl}/checkout/from-cart`, 
      request,
      options
    ).pipe(
      tap(res => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.sessionId.set(res.data.id);
          this.checkoutSession.set(res.data);
          this.setStep(2);
        }
      }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || 'Failed to start checkout');
        return of({ success: false, message: err.error?.message || 'Failed to start checkout' });
      })
    );
  }

  getSession(id: string): Observable<{ success: boolean, data?: StorefrontCheckoutReadModel }> {
    this.isLoading.set(true);
    return this.http.get<{ success: boolean, data: StorefrontCheckoutReadModel }>(
      `${this.baseUrl}/checkout/${id}`
    ).pipe(
      tap(res => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.checkoutSession.set(res.data);
        }
      }),
      catchError(err => {
        this.isLoading.set(false);
        return of({ success: false });
      })
    );
  }

  getStores(): Observable<StorefrontStoreReadModel[]> {
    this.isLoading.set(true);
    return this.http.get<StorefrontStoreReadModel[]>(
      `${this.baseUrl}/fulfillment/stores`
    ).pipe(
      tap(stores => {
        this.isLoading.set(false);
        this.availableStores.set(stores);
      }),
      catchError(err => {
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  getCollectionOptions(outletId: string, days: number = 5): Observable<StorefrontCollectionOptionsReadModel | null> {
    this.isLoading.set(true);
    return this.http.get<StorefrontCollectionOptionsReadModel>(
      `${this.baseUrl}/fulfillment/stores/${outletId}/collection-options?days=${days}`
    ).pipe(
      tap(options => {
        this.isLoading.set(false);
        this.collectionOptions.set(options);
      }),
      catchError(err => {
        this.isLoading.set(false);
        return of(null);
      })
    );
  }

  updateCollection(request: UpdateStorefrontCheckoutCollectionRequest): Observable<{ success: boolean, data?: StorefrontCheckoutReadModel, message?: string }> {
    const id = this.sessionId();
    if (!id) return of({ success: false, message: 'No active session' });
    
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.patch<{ success: boolean, data: StorefrontCheckoutReadModel, message: string }>(
      `${this.baseUrl}/checkout/${id}/collection`, 
      request
    ).pipe(
      tap(res => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.checkoutSession.set(res.data);
          this.setStep(3);
        }
      }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || 'Failed to update collection details');
        return of({ success: false, message: err.error?.message || 'Failed to update collection details' });
      })
    );
  }

  confirmOrder(idempotencyKey: string): Observable<{ success: boolean, data?: StorefrontCheckoutReadModel, message?: string }> {
    const id = this.sessionId();
    if (!id) return of({ success: false, message: 'No active session' });
    
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.post<{ success: boolean, data: StorefrontCheckoutReadModel, message: string }>(
      `${this.baseUrl}/checkout/${id}/confirm`, 
      {},
      { headers: { 'Idempotency-Key': idempotencyKey } }
    ).pipe(
      tap(res => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.checkoutSession.set(res.data);
          this.setStep(4);
          // Order placed successfully, clear the cart from local state
          this.cartService.clearLocalState();
          this.toastService.success('Order placed successfully!');
        }
      }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || 'Failed to place order');
        this.toastService.error(err.error?.message || 'Failed to place order');
        return of({ success: false, message: err.error?.message || 'Failed to place order' });
      })
    );
  }
}
