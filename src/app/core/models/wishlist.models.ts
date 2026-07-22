export interface AddWishlistItemRequest {
  productId: string;
  productVariantId?: string;
}

export interface WishlistReadModel {
  id: string;
  customerId: string;
  name: string;
  itemCount: number;
  items: WishlistItemReadModel[];
}

export interface WishlistItemReadModel {
  id: string;
  productId: string;
  productVariantId?: string;
  productName: string;
  productSlug: string;
  variantName?: string;
  price: number;
  currencyCode?: string;
  imageUrl?: string;
  isInStock: boolean;
}
