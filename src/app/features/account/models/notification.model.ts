export interface NotificationApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  errors?: string[];
  traceId?: string;
}

export interface NotificationInboxListResponse {
  items: NotificationInboxItemResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface NotificationInboxItemResponse {
  id: string;
  messageId: string;
  eventCode: string;
  sourceModule?: string | null;
  sourceReferenceType?: string | null;
  sourceReferenceId?: string | null;
  title: string;
  body: string;
  linkUrl?: string | null;
  status: NotificationInboxStatus;
  isRead: boolean;
  createdAt: string;
  deliveredAt?: string | null;
  readAt?: string | null;
}

export interface NotificationUnreadCountResponse {
  unreadCount: number;
}

export interface NotificationMarkReadResponse {
  id: string;
  status: NotificationInboxStatus;
  readAt?: string | null;
}

export interface NotificationMarkAllReadResponse {
  updatedCount: number;
  readAt: string;
}

export type NotificationInboxStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'DELETED' | string;