export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  itemCount?: number;
  sortOrder?: number;
}
