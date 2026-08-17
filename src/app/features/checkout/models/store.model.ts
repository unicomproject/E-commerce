export interface Store {
  id: string;
  name: string;
  address: string;
  isAvailable: boolean;
  isOpen?: boolean;
  isDefault?: boolean;
  imageUrl?: string | null;
  distance?: string;
  statusText?: string;
  closingTime?: string | null;
  collectionTime?: string;
  parkingInfo?: string;
  isRecommended?: boolean;
}
