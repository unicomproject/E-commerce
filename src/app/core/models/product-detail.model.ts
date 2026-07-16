export interface StorefrontProductImageReadModel {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface StorefrontProductOptionValueReadModel {
  id: string;
  name: string;
  displayName: string;
  colorHex?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface StorefrontProductVariantReadModel {
  id: string;
  sku?: string;
  variantName: string;
  colour?: string;
  size?: string;
  price: number;
  isDefault: boolean;
  isInStock: boolean;
}

export interface StorefrontProductDetailReadModel {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  isInStock: boolean;
  badge?: string;
  images: StorefrontProductImageReadModel[];
  colours: StorefrontProductOptionValueReadModel[];
  sizes: StorefrontProductOptionValueReadModel[];
  variants: StorefrontProductVariantReadModel[];
  highlights: string[];
  deliveryInfo: string;
  returnInfo: string;
}
