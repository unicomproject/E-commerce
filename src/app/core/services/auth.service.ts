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
  GoogleLoginRequest,
  AuthResponse,
  CustomerRequestOtpRequest,
  CustomerVerifyOtpRequest,
  CustomerGoogleLoginRequest,
  CustomerLoginCustomerDto
} from '../models';
import {
  clearCustomerAuthStorage,
  getValidCustomerAccessToken,
  hasCustomerSessionHint,
  setCustomerAccessToken
} from './customer-auth-token';
import { ToastService } from './toast.service';
import { GoogleIdentityService } from './google-identity.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private googleIdentityService = inject(GoogleIdentityService);
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

  requestOtp(email: string): Observable<AuthResponse> {
    const request: CustomerRequestOtpRequest = { email };

    return this.http.post<AuthResponse>(`${this.baseUrl}/request-otp`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.toastService.success(response.message || 'OTP sent successfully.');
        }
      }),
      catchError(err => this.toAuthFailure(err, 'Failed to send OTP', true))
    );
  }

  verifyOtp(email: string, code: string, rememberMe: boolean = false): Observable<AuthResponse> {
    const request: CustomerVerifyOtpRequest = {
      email,
      code,
      deviceName: this.resolveDeviceName(),
      rememberMe
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/verify-otp`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data) {
          setCustomerAccessToken(response.data.accessToken);
          this.currentUserSubject.next(response.data.customer);
          this.toastService.success(`Welcome, ${response.data.customer.displayName || 'User'}!`);
        }
      }),
      catchError(err => this.toAuthFailure(
        err,
        'Verification failed',
        err.error?.errorCode !== 'customer_auth.invalid_verification_code'))
    );
  }

  googleLogin(data: GoogleLoginRequest): Observable<AuthResponse> {
    const request: CustomerGoogleLoginRequest = {
      idToken: data.idToken || '',
      deviceName: data.deviceName || this.resolveDeviceName(),
      rememberMe: data.rememberMe === true,
      agreeTerms: data.agreeTerms === true,
      sendOffers: data.sendOffers === true
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/google`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.data) {
          setCustomerAccessToken(response.data.accessToken);
          this.currentUserSubject.next(response.data.customer);
          this.toastService.success(`Welcome, ${response.data.customer.displayName || 'User'}!`);
        }
      }),
      catchError(err => this.toAuthFailure(err, 'Google sign-in failed', false))
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
    this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      catchError(() => of(null))
    ).subscribe();

    this.googleIdentityService.signOut();
    this.clearLocalSession();
    this.toastService.info('Logged out successfully');
    return of(null);
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

  private resolveDeviceName(): string {
    if (typeof navigator === 'undefined') {
      return 'Web browser';
    }

    return navigator.userAgent || 'Web browser';
  }
}
