export interface LoginRequest {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  agreeTerms?: boolean;
  sendOffers?: boolean;
}

export interface VerifyEmailRequest {
  email?: string;
  code?: string;
}

export interface ResendEmailVerificationRequest {
  email?: string;
}

export interface ForgotPasswordRequest {
  email?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  token?: string;
  newPassword?: string;
}

export interface GoogleLoginRequest {
  idToken?: string;
  deviceName?: string;
  rememberMe?: boolean;
  agreeTerms?: boolean;
  sendOffers?: boolean;
}

// Backend DTOs
export interface CustomerLoginRequest {
  emailOrPhone: string;
  password: string;
  deviceName?: string;
}

export interface CustomerRegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  agreeTerms: boolean;
  sendOffers: boolean;
}

export interface CustomerVerifyEmailRequest {
  email: string;
  code: string;
}

export interface CustomerResendEmailVerificationRequest {
  email: string;
}

export interface CustomerForgotPasswordRequest {
  email: string;
}

export interface CustomerResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface CustomerGoogleLoginRequest {
  idToken: string;
  deviceName?: string;
  rememberMe: boolean;
  agreeTerms: boolean;
  sendOffers: boolean;
}

export interface CustomerLoginCustomerDto {
  id: string;
  tenantId: string;
  displayName: string;
  email?: string;
  phone?: string;
}

export interface CustomerLoginResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  customer: CustomerLoginCustomerDto;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: CustomerLoginResponse;
  errorCode?: string;
}
