export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  actionUrl?: string;
  description?: string;
  buttonText?: string;
  actionText?: string;
  bannerType: 'Hero' | 'Promo';
}
