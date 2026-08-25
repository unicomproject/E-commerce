export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currencyCode?: string;
  imageUrl?: string;
  rating?: number;
  slug?: string;
}
