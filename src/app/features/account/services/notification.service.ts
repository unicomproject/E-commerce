import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, Subscription, of, timer } from 'rxjs';
import { catchError, filter, finalize, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  NotificationApiResponse,
  NotificationInboxItemResponse,
  NotificationInboxListResponse,
  NotificationMarkAllReadResponse,
  NotificationMarkReadResponse,
  NotificationUnreadCountResponse
} from '../../../features/account/models/notification.model';
import { AuthService } from '../../../core/services/auth.service';

const DEFAULT_PAGE_SIZE = 20;
const POLLING_INTERVAL_MS = 45_000;

function emptyInbox(page = 1, pageSize = DEFAULT_PAGE_SIZE): NotificationInboxListResponse {
  return {
    items: [],
    page,
    pageSize,
    totalCount: 0,
    totalPages: 0
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/ecommerce/storefront/notifications`;
  private pollingSubscription: Subscription | null = null;

  readonly inbox = signal<NotificationInboxListResponse>(emptyInbox());
  readonly unreadCount = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly marking = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly panelOpen = signal<boolean>(false);

  readonly items = computed(() => this.inbox().items);
  readonly hasUnread = computed(() => this.unreadCount() > 0);
  readonly hasMore = computed(() => {
    const inbox = this.inbox();
    return inbox.totalPages > 0 && inbox.page < inbox.totalPages;
  });

  startPolling(): void {
    if (!this.canUseCustomerApi() || (this.pollingSubscription && !this.pollingSubscription.closed)) {
      return;
    }

    this.pollingSubscription = timer(0, POLLING_INTERVAL_MS).pipe(
      filter(() => this.canUseCustomerApi()),
      switchMap(() => this.refreshUnreadCount())
    ).subscribe();
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  clearState(): void {
    this.stopPolling();
    this.panelOpen.set(false);
    this.inbox.set(emptyInbox());
    this.unreadCount.set(0);
    this.loading.set(false);
    this.marking.set(false);
    this.error.set(null);
  }

  openPanel(): void {
    this.panelOpen.set(true);
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }

  togglePanel(): void {
    this.panelOpen.update(open => !open);
  }

  loadNotifications(page = 1, pageSize = DEFAULT_PAGE_SIZE): Observable<NotificationApiResponse<NotificationInboxListResponse>> {
    if (!this.canUseCustomerApi()) {
      this.clearState();
      return of({ success: false, message: 'Please sign in to view notifications.', data: emptyInbox(page, pageSize) });
    }

    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<NotificationApiResponse<NotificationInboxListResponse>>(this.apiUrl, { params }).pipe(
      tap(response => {
        if (response.success && response.data) {
          const nextInbox = response.data;
          
          const oneDayAgo = new Date();
          oneDayAgo.setHours(oneDayAgo.getHours() - 24);
          
          nextInbox.items = nextInbox.items.filter(item => {
            if (item.isRead && item.readAt) {
              const readDate = new Date(item.readAt);
              return readDate >= oneDayAgo;
            }
            return true;
          });

          if (page > 1) {
            const current = this.inbox();
            this.inbox.set({
              ...nextInbox,
              items: [...current.items, ...nextInbox.items]
            });
          } else {
            this.inbox.set(nextInbox);
          }
        }
      }),
      catchError(error => {
        const message = error.error?.message || 'Could not load notifications.';
        this.error.set(message);
        return of({ success: false, message, data: this.inbox() });
      }),
      finalize(() => this.loading.set(false))
    );
  }

  loadNextPage(): Observable<NotificationApiResponse<NotificationInboxListResponse>> {
    const current = this.inbox();
    if (current.totalPages === 0 || current.page >= current.totalPages) {
      return of({ success: true, message: 'No more notifications.', data: current });
    }

    return this.loadNotifications(current.page + 1, current.pageSize || DEFAULT_PAGE_SIZE);
  }

  refreshUnreadCount(): Observable<NotificationApiResponse<NotificationUnreadCountResponse>> {
    if (!this.canUseCustomerApi()) {
      this.unreadCount.set(0);
      return of({ success: false, message: 'Please sign in to view notifications.', data: { unreadCount: 0 } });
    }

    return this.http.get<NotificationApiResponse<NotificationUnreadCountResponse>>(`${this.apiUrl}/unread-count`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.unreadCount.set(response.data.unreadCount);
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          this.clearState();
        }
        return of({ success: false, message: error.error?.message || 'Could not refresh notifications.', data: { unreadCount: this.unreadCount() } });
      })
    );
  }

  markAsRead(notificationId: string): Observable<NotificationApiResponse<NotificationMarkReadResponse>> {
    if (!this.canUseCustomerApi() || !notificationId) {
      return of({ success: false, message: 'A valid notification is required.' });
    }

    const existing = this.items().find(item => item.id === notificationId);
    if (existing?.isRead) {
      return of({ success: true, message: 'Notification already read.', data: { id: notificationId, status: existing.status, readAt: existing.readAt } });
    }

    this.marking.set(true);
    return this.http.put<NotificationApiResponse<NotificationMarkReadResponse>>(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.patchItemRead(response.data.id, response.data.status, response.data.readAt || new Date().toISOString());
          this.unreadCount.update(count => Math.max(0, count - 1));
        }
      }),
      catchError(error => of({ success: false, message: error.error?.message || 'Could not mark notification as read.' })),
      finalize(() => this.marking.set(false))
    );
  }

  markAllAsRead(): Observable<NotificationApiResponse<NotificationMarkAllReadResponse>> {
    if (!this.canUseCustomerApi()) {
      return of({ success: false, message: 'Please sign in to update notifications.' });
    }

    this.marking.set(true);
    return this.http.put<NotificationApiResponse<NotificationMarkAllReadResponse>>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(response => {
        if (response.success && response.data) {
          const readAt = response.data.readAt || new Date().toISOString();
          this.inbox.update(current => ({
            ...current,
            items: current.items.map(item => ({
              ...item,
              status: 'READ',
              isRead: true,
              readAt: item.readAt || readAt
            }))
          }));
          this.unreadCount.set(0);
        }
      }),
      catchError(error => of({ success: false, message: error.error?.message || 'Could not mark notifications as read.' })),
      finalize(() => this.marking.set(false))
    );
  }

  resolveNotificationRoute(item: NotificationInboxItemResponse): string | null {
    const link = item.linkUrl?.trim();
    if (!link) {
      return null;
    }

    if (link.startsWith('/account/')) {
      return link;
    }

    if (link.startsWith('/orders/')) {
      return `/account${link}`;
    }

    return link.startsWith('/') ? link : `/${link}`;
  }

  private patchItemRead(notificationId: string, status: string, readAt: string): void {
    this.inbox.update(current => ({
      ...current,
      items: current.items.map(item => item.id === notificationId
        ? { ...item, status, isRead: status.toUpperCase() === 'READ', readAt }
        : item)
    }));
  }

  private canUseCustomerApi(): boolean {
    return this.authService.isAuthenticated;
  }
}