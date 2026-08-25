export interface StorefrontProductImageReadModel {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface StorefrontProductOptionReadModel {
  optionName: string;
  values: StorefrontProductOptionValueReadModel[];
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
  optionValues: { [key: string]: string };
  price: number;
  originalPrice?: number;
  currencyCode?: string;
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
  originalPrice?: number;
  currencyCode?: string;
  rating: number;
  reviewCount: number;
  isInStock: boolean;
  badge?: string;
  categoryName?: string;
  categorySlug?: string;
  subCategoryName?: string;
  subCategorySlug?: string;
  brandName?: string;
  brandSlug?: string;
  images: StorefrontProductImageReadModel[];
  options: StorefrontProductOptionReadModel[];
  variants: StorefrontProductVariantReadModel[];
  highlights: string[];
  deliveryInfo: string;
  returnInfo: string;
}

export interface ProductReviewSummaryReadModel {
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ProductReviewItemReadModel {
  id: string;
  productId: string;
  ratingValue: number;
  reviewTitle?: string;
  reviewText?: string;
  customerDisplayName: string;
  isVerifiedPurchase: boolean;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductReviewsPageReadModel {
  productId: string;
  canWriteReview: boolean;
  summary: ProductReviewSummaryReadModel;
  items: ProductReviewItemReadModel[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CustomerReviewItemReadModel {
  id: string;
  productId: string;
  productName: string;
  productThumbnailUrl?: string;
  ratingValue: number;
  reviewTitle?: string;
  reviewText?: string;
  isVerifiedPurchase: boolean;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerReviewsPageReadModel {
  items: CustomerReviewItemReadModel[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface EligibleReviewItemReadModel {
  productId: string;
  productName: string;
  productThumbnailUrl?: string;
}

export interface EligibleReviewsPageReadModel {
  items: EligibleReviewItemReadModel[];
  page: number;
  pageSize: number;
  totalCount: number;
}
