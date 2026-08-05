import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  CustomerAddressDto, 
  CreateCustomerAddressRequest, 
  UpdateCustomerAddressRequest 
} from '../models/customer-address.model';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  errorCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ecommerce/storefront/customer/addresses`;

  getAddresses(): Observable<ApiResponse<CustomerAddressDto[]>> {
    return this.http.get<ApiResponse<CustomerAddressDto[]>>(this.apiUrl);
  }

  getAddressById(id: string): Observable<ApiResponse<CustomerAddressDto>> {
    return this.http.get<ApiResponse<CustomerAddressDto>>(`${this.apiUrl}/${id}`);
  }

  createAddress(request: CreateCustomerAddressRequest): Observable<ApiResponse<CustomerAddressDto>> {
    return this.http.post<ApiResponse<CustomerAddressDto>>(this.apiUrl, request);
  }

  updateAddress(id: string, request: UpdateCustomerAddressRequest): Observable<ApiResponse<CustomerAddressDto>> {
    return this.http.put<ApiResponse<CustomerAddressDto>>(`${this.apiUrl}/${id}`, request);
  }

  deleteAddress(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  setDefaultAddress(id: string, type: 'SHIPPING' | 'BILLING'): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/default?type=${type}`, {});
  }
}
