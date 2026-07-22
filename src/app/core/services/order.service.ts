import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerOrderDetailReadModel, CustomerOrderListReadModel } from '../models/order.model';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ecommerce/storefront/orders`;

  // Signals for state management
  public ordersLoading = signal<boolean>(false);
  public ordersList = signal<CustomerOrderListReadModel | null>(null);
  
  public orderDetailLoading = signal<boolean>(false);
  public orderDetail = signal<CustomerOrderDetailReadModel | null>(null);

  /**
   * Fetch orders list with optional status and pagination
   */
  getOrders(status: string = 'all', page: number = 1, pageSize: number = 10): Observable<ApiResponse<CustomerOrderListReadModel>> {
    this.ordersLoading.set(true);
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
      
    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<CustomerOrderListReadModel>>(this.apiUrl, { params }).pipe(
      tap({
        next: (response) => {
          this.ordersList.set(response.data);
          this.ordersLoading.set(false);
        },
        error: () => this.ordersLoading.set(false)
      })
    );
  }

  /**
   * Fetch details for a specific order
   */
  getOrderDetails(orderId: string): Observable<ApiResponse<CustomerOrderDetailReadModel>> {
    this.orderDetailLoading.set(true);
    
    return this.http.get<ApiResponse<CustomerOrderDetailReadModel>>(`${this.apiUrl}/${orderId}`).pipe(
      tap({
        next: (response) => {
          this.orderDetail.set(response.data);
          this.orderDetailLoading.set(false);
        },
        error: () => this.orderDetailLoading.set(false)
      })
    );
  }

  /**
   * Cancel a specific order
   */
  cancelOrder(orderId: string, reason?: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${orderId}/cancel`, { reason });
  }

  /**
   * Reset order detail state (useful when navigating away)
   */
  clearOrderDetail(): void {
    this.orderDetail.set(null);
  }
}
