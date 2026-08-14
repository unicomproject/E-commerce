export interface StorefrontCartReadModel {
  id: string;
  cartNumber: string;
  currencyCode: string;
  status: string;
  items: StorefrontCartItemReadModel[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  chargeTotal: number;
  grandTotal: number;
  totalQuantity: number;
  isTaxInclusive: boolean;
  expiresAt?: string;
}

export interface StorefrontCartItemReadModel {
  id: string;
  lineNumber: number;
  productId: string;
  productVariantId?: string;
  slug?: string;
  name: string;
  variantName?: string;
  sku?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  lineTotal: number;
  isInStock: boolean;
  options: StorefrontCartItemOptionReadModel[];
}

export interface StorefrontCartItemOptionReadModel {
  name: string;
  value: string;
  colorHex?: string;
}

export interface AddStorefrontCartItemRequest {
  productId: string;
  productVariantId?: string;
  quantity: number;
}

export interface UpdateStorefrontCartItemRequest {
  quantity: number;
}
