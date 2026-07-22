export interface StorefrontSearchRequest {
  searchText?: string;
  minPrice?: number;
  maxPrice?: number;
  colour?: string;
  size?: string;
  inStock?: boolean;
  categoryId?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface StorefrontPagedReadModel<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StorefrontSearchMatchReadModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface StorefrontSearchReadModel {
  products: StorefrontPagedReadModel<StorefrontProductListReadModel>;
  categories: StorefrontSearchMatchReadModel[];
  collections: StorefrontSearchMatchReadModel[];
  totalCount: number;
}

export interface StorefrontProductListReadModel {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  currencyCode?: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isInStock: boolean;
  badge?: string;
}
