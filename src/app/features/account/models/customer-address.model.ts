export interface CustomerAddressDto {
  id: string;
  contactName: string;
  contactPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  addressType: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface CreateCustomerAddressRequest {
  contactName: string;
  contactPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  addressType: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface UpdateCustomerAddressRequest {
  contactName: string;
  contactPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  addressType: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}
