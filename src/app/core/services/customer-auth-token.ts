const LEGACY_CUSTOMER_ACCESS_TOKEN_KEY = 'access_token';
const LEGACY_CUSTOMER_CURRENT_USER_KEY = 'current_user';

let customerAccessToken: string | null = null;

interface JwtPayload {
  exp?: number;
  identity_type?: string;
}

export function getValidCustomerAccessToken(): string | null {
  if (!isValidCustomerAccessToken(customerAccessToken)) {
    clearCustomerAuthStorage();
    return null;
  }

  return customerAccessToken;
}

export function setCustomerAccessToken(token: string): void {
  customerAccessToken = token;
  clearLegacyCustomerAuthStorage();
}

export function clearCustomerAuthStorage(): void {
  customerAccessToken = null;
  clearLegacyCustomerAuthStorage();
}

function clearLegacyCustomerAuthStorage(): void {
  localStorage.removeItem(LEGACY_CUSTOMER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_CUSTOMER_CURRENT_USER_KEY);
}

function isValidCustomerAccessToken(token: string | null): token is string {
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);
  if (!payload || payload.identity_type !== 'customer' || !payload.exp) {
    return false;
  }

  const expirySkewSeconds = 30;
  const currentSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > currentSeconds + expirySkewSeconds;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const payloadPart = token.split('.')[1];
  if (!payloadPart) {
    return null;
  }

  try {
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}
