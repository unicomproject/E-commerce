export interface CustomerOrderListReadModel {
  items: CustomerOrderSummaryReadModel[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CustomerOrderSummaryReadModel {
  id: string;
  orderNumber: string;
  displayOrderNumber: string;
  status: string;
  statusLabel: string;
  placedAt: string | null;
  requestedCollectionAt: string | null;
  requestedCollectionEndAt: string | null;
  collectionTimezone: string | null;
  outletId: string | null;
  outletName: string | null;
  itemCount: number;
  grandTotal: number;
  currencyCode: string;
  paymentStatus: string;
  paymentLabel: string;
  thumbnailUrls: string[];
}

export interface CustomerOrderDetailReadModel {
  id: string;
  orderNumber: string;
  displayOrderNumber: string;
  status: string;
  statusLabel: string;
  statusMessage: string;
  canShowCollectionQr: boolean;
  collectionQr: string | null;
  placedAt: string | null;
  requestedCollectionAt: string | null;
  requestedCollectionEndAt: string | null;
  collectionTimezone: string | null;
  outletId: string | null;
  outletName: string | null;
  paymentStatus: string;
  paymentLabel: string;
  currencyCode: string;
  itemCount: number;
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  collectionChargeAmount: number;
  grandTotal: number;
  isTaxInclusive: boolean;
  timelineSteps: CustomerOrderTimelineStepReadModel[];
  availableActions: string[];
  items: CustomerOrderDetailItemReadModel[];
}

export interface CustomerOrderTimelineStepReadModel {
  code: string;
  label: string;
  description: string;
  state: 'COMPLETED' | 'CURRENT' | 'PENDING' | string;
  occurredAt: string | null;
  icon: string;
  badgeLabel: string | null;
}

export interface CustomerOrderDetailItemReadModel {
  id: string;
  productId: string;
  productVariantId: string | null;
  productName: string;
  variantName: string | null;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
}
