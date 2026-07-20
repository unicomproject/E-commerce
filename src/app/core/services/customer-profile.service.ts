import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerProfileResponse, CustomerProfileUpdateRequest } from '../models';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/ecommerce/storefront/customer/profile`;

  getProfile(): Observable<ApiResponse<CustomerProfileResponse>> {
    return this.http.get<ApiResponse<CustomerProfileResponse>>(this.baseUrl, { withCredentials: true });
  }

  updateProfile(data: CustomerProfileUpdateRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.baseUrl, data, { withCredentials: true });
  }
}
