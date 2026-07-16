import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/ecommerce/storefront/auth`;

  private currentUserSubject = new BehaviorSubject<CustomerLoginCustomerDto | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userJson = localStorage.getItem('current_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse user from storage');
        localStorage.removeItem('current_user');
      }
    }
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    const request: CustomerLoginRequest = {
      emailOrPhone: data.email || '',
      password: data.password || ''
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('access_token', response.data.accessToken);
          localStorage.setItem('current_user', JSON.stringify(response.data.customer));
          this.currentUserSubject.next(response.data.customer);
        }
      }),
      catchError(err => {
        return of({
          success: false,
          message: err.error?.message || 'Login failed'
        });
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
      }),
      catchError(() => {
        // Even if server fails, clear local state
        localStorage.removeItem('access_token');
        localStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  // Mocks for now until backend is ready
  register(data: RegisterRequest): Observable<AuthResponse> {
    console.log('Mock Register Request:', data);
    return of({ success: true, message: 'Registration successful. Please verify your email.' });
  }

  verifyEmail(data: VerifyEmailRequest): Observable<AuthResponse> {
    console.log('Mock Verify Email Request:', data);
    return of({ success: true, message: 'Email verified successfully.' });
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
    console.log('Mock Forgot Password Request:', data);
    return of({ success: true, message: 'Password reset link sent to your email.' });
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    console.log('Mock Reset Password Request:', data);
    return of({ success: true, message: 'Password has been reset successfully.' });
  }
}
