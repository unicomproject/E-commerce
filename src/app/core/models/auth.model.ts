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

export interface ForgotPasswordRequest {
  email?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  newPassword?: string;
}

// Backend DTOs
export interface CustomerLoginRequest {
  emailOrPhone: string;
  password: string;
  deviceName?: string;
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
}
