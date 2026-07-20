import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest, 
  RegisterRequest, 
  VerifyEmailRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  AuthResponse,
  CustomerLoginRequest,
  CustomerLoginCustomerDto
} from '../models';
import {
  clearCustomerAuthStorage,
  getValidCustomerAccessToken,
  setCustomerAccessToken
} from './customer-auth-token';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private baseUrl = `${environment.apiUrl}/ecommerce/storefront/auth`;

  private currentUserSubject = new BehaviorSubject<CustomerLoginCustomerDto | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  get isAuthenticated(): boolean {
    return getValidCustomerAccessToken() !== null;
  }

  get accessToken(): string | null {
    return getValidCustomerAccessToken();
  }

  get currentUserSnapshot(): CustomerLoginCustomerDto | null {
    return this.currentUserSubject.value;
  }

  clearLocalSession(): void {
    clearCustomerAuthStorage();
    this.currentUserSubject.next(null);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    const request: CustomerLoginRequest = {
      emailOrPhone: data.email || '',
      password: data.password || ''
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data) {
          setCustomerAccessToken(response.data.accessToken);
          this.currentUserSubject.next(response.data.customer);
          this.toastService.success(`Welcome back, ${response.data.customer.displayName || 'User'}!`);
        }
      }),
      catchError(err => {
        this.toastService.error(err.error?.message || 'Login failed');
        return of({
          success: false,
          message: err.error?.message || 'Login failed'
        });
      })
    );
  }

  refreshSession(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data) {
          setCustomerAccessToken(response.data.accessToken);
          this.currentUserSubject.next(response.data.customer);
        }
      }),
      catchError(err => {
        this.clearLocalSession();
        return of({
          success: false,
          message: err.error?.message || 'Session expired'
        });
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearLocalSession();
        this.toastService.info('Logged out successfully');
      }),
      catchError(() => {
        // Even if server fails, clear local state
        this.clearLocalSession();
        return of(null);
      })
    );
  }

  // Mocks for now until backend is ready
  register(data: RegisterRequest): Observable<AuthResponse> {
    console.log('Mock Register Request:', data);
    this.toastService.success('Registration successful. Please verify your email.');
    return of({ success: true, message: 'Registration successful. Please verify your email.' });
  }

  verifyEmail(data: VerifyEmailRequest): Observable<AuthResponse> {
    console.log('Mock Verify Email Request:', data);
    this.toastService.success('Email verified successfully.');
    return of({ success: true, message: 'Email verified successfully.' });
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
    console.log('Mock Forgot Password Request:', data);
    this.toastService.success('Password reset link sent to your email.');
    return of({ success: true, message: 'Password reset link sent to your email.' });
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    console.log('Mock Reset Password Request:', data);
    this.toastService.success('Password has been reset successfully.');
    return of({ success: true, message: 'Password has been reset successfully.' });
  }
}
