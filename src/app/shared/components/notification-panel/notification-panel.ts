import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCheckCheck, lucideChevronRight, lucideInbox, lucidePackage, lucideRefreshCw, lucideX } from '@ng-icons/lucide';
import { NotificationInboxItemResponse } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideBell, lucideCheckCheck, lucideChevronRight, lucideInbox, lucidePackage, lucideRefreshCw, lucideX })],
  templateUrl: './notification-panel.html'
})
export class NotificationPanelComponent implements OnInit {
  public notificationService = inject(NotificationService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.notificationService.panelOpen()) {
      this.refresh();
    }
  }

  refresh(): void {
    this.notificationService.loadNotifications(1, 20).subscribe();
    this.notificationService.refreshUnreadCount().subscribe();
  }

  close(): void {
    this.notificationService.closePanel();
  }

  markAllRead(event: Event): void {
    event.stopPropagation();
    if (this.notificationService.unreadCount() <= 0) {
      return;
    }

    this.notificationService.markAllAsRead().subscribe();
  }

  loadMore(event: Event): void {
    event.stopPropagation();
    this.notificationService.loadNextPage().subscribe();
  }

  openNotification(item: NotificationInboxItemResponse): void {
    const route = this.notificationService.resolveNotificationRoute(item);
    if (!item.isRead) {
      this.notificationService.markAsRead(item.id).subscribe();
    }

    this.close();
    if (route) {
      this.router.navigateByUrl(route);
    }
  }

  notificationIcon(item: NotificationInboxItemResponse): string {
    return item.sourceReferenceType === 'SALES_ORDER' || item.eventCode.startsWith('ecommerce.order')
      ? 'lucidePackage'
      : 'lucideBell';
  }
}