import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, finalize, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResendEmailVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  CustomerLoginRequest,
  CustomerLoginCustomerDto,
  CustomerRegisterRequest,
  CustomerVerifyEmailRequest,
  CustomerResendEmailVerificationRequest,
  CustomerForgotPasswordRequest,
  CustomerResetPasswordRequest
} from '../models';
import {
  clearCustomerAuthStorage,
  getValidCustomerAccessToken,
  hasCustomerSessionHint,
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
  private refreshSessionRequest$: Observable<AuthResponse> | null = null;

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

  get hasSessionHint(): boolean {
    return hasCustomerSessionHint();
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
      catchError(err => this.toAuthFailure(
        err,
        'Login failed',
        err.error?.errorCode !== 'customer_auth.email_not_verified'))
    );
  }

  refreshSession(): Observable<AuthResponse> {
    if (this.refreshSessionRequest$) {
      return this.refreshSessionRequest$;
    }

    this.refreshSessionRequest$ = this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {}, { withCredentials: true }).pipe(
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
      }),
      finalize(() => {
        this.refreshSessionRequest$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    return this.refreshSessionRequest$;
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearLocalSession();
        this.toastService.info('Logged out successfully');
      }),
      catchError(() => {
        this.clearLocalSession();
        return of(null);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const request: CustomerRegisterRequest = {
      email: data.email || '',
      password: data.password || '',
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      agreeTerms: data.agreeTerms === true,
      sendOffers: data.sendOffers === true
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.toastService.success(response.message || 'Registration successful. Please verify your email.');
        }
      }),
      catchError(err => this.toAuthFailure(err, 'Registration failed'))
    );
  }

  verifyEmail(data: VerifyEmailRequest): Observable<AuthResponse> {
    const request: CustomerVerifyEmailRequest = {
      email: data.email || '',
      code: data.code || ''
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/verify-email`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.toastService.success(response.message || 'Email verified successfully.');
        }
      }),
      catchError(err => this.toAuthFailure(err, 'Email verification failed'))
    );
  }

  resendEmailVerification(data: ResendEmailVerificationRequest): Observable<AuthResponse> {
    const request: CustomerResendEmailVerificationRequest = {
      email: data.email || ''
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/resend-email-verification`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.toastService.success(response.message || 'Verification code sent.');
        }
      }),
      catchError(err => this.toAuthFailure(err, 'Could not resend verification code'))
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
    const request: CustomerForgotPasswordRequest = {
      email: data.email || ''
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/forgot-password`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.toastService.success(response.message || 'If an account exists, a password reset link has been sent.');
        }
      }),
      catchError(err => this.toAuthFailure(err, 'Could not send password reset email'))
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    const request: CustomerResetPasswordRequest = {
      email: data.email || '',
      token: data.token || '',
      newPassword: data.newPassword || ''
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/reset-password`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.toastService.success(response.message || 'Password has been reset successfully.');
        }
      }),
      catchError(err => this.toAuthFailure(err, 'Password reset failed'))
    );
  }

  private toAuthFailure(err: HttpErrorResponse, fallbackMessage: string, showToast = true): Observable<AuthResponse> {
    const message = err.error?.message || fallbackMessage;
    if (showToast) {
      this.toastService.error(message);
    }
    return of({
      success: false,
      message,
      errorCode: err.error?.errorCode
    });
  }
}
