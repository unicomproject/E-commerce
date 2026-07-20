export interface CreateStorefrontCheckoutFromCartRequest {
  selectedOutletId?: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  pickupContactEmail?: string;
}

export interface UpdateStorefrontCheckoutCollectionRequest {
  selectedOutletId: string;
  requestedCollectionAt: string;
}

export interface StorefrontCheckoutLineReadModel {
  id: string;
  lineNumber: number;
  productId: string;
  productVariantId?: string;
  sku?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  lineTotal: number;
}

export interface StorefrontCheckoutOrderReadModel {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  requestedCollectionAt?: string;
  requestedCollectionEndAt?: string;
  collectionTimezone?: string;
}

export interface StorefrontCheckoutReadModel {
  id: string;
  cartId: string;
  checkoutNumber: string;
  status: string;
  fulfillmentMethodCode: string;
  selectedOutletId: string;
  selectedOutletName: string;
  requestedCollectionAt?: string;
  requestedCollectionEndAt?: string;
  collectionTimezone?: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  pickupContactEmail?: string;
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  chargeTotal: number;
  grandTotal: number;
  totalQuantity: number;
  expiresAt?: string;
  items: StorefrontCheckoutLineReadModel[];
  order?: StorefrontCheckoutOrderReadModel;
}

export interface StorefrontStoreReadModel {
  id: string;
  name: string;
  address: string;
  isAvailable: boolean;
  isOpen: boolean;
  preparationLeadMinutes: number;
}

export interface StorefrontCollectionWindowReadModel {
  startAt: string;
  endAt: string;
}

export interface StorefrontCollectionDateReadModel {
  date: string;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  windows: StorefrontCollectionWindowReadModel[];
}

export interface StorefrontCollectionOptionsReadModel {
  outletId: string;
  outletName: string;
  timezone: string;
  preparationLeadMinutes: number;
  pickupWindowMinutes: number;
  cutoffTime?: string;
  generatedAt: string;
  earliestCollectionAt: string;
  dates: StorefrontCollectionDateReadModel[];
}
