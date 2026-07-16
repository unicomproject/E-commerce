export interface Store {
  id: string;
  name: string;
  address: string;
  isAvailable: boolean;
  
  // UI Specific (Mocked for now as backend doesn't provide these yet)
  imageUrl?: string;
  distance?: string;
  statusText?: string;
  closingTime?: string;
  collectionTime?: string;
  parkingInfo?: string;
  isRecommended?: boolean;
}
