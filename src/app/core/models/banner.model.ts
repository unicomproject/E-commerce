export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  description?: string;
  buttonText?: string;
  bannerType: 'Hero' | 'Promo';
}
