export interface Product {
  id: string;
  name: string;
  price: number;
  currencyCode?: string;
  imageUrl?: string;
  rating?: number;
  slug?: string;
}
