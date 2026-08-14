import { MobileHeaderComponent } from '../../../../../shared/components/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject , ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCheckCheck, lucideChevronRight, lucideInbox, lucidePackage, lucideRefreshCw } from '@ng-icons/lucide';
import { NotificationInboxItemResponse } from '../../../../../features/account/models/notification.model';
import { NotificationService } from '../../../../../features/account/services/notification.service';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-notifications',
  standalone: true,
  imports: [CommonModule, NgIconComponent, MobileHeaderComponent],
  viewProviders: [provideIcons({ lucideBell, lucideCheckCheck, lucideChevronRight, lucideInbox, lucidePackage, lucideRefreshCw })],
  templateUrl: './notifications.html',
  host: { class: 'block w-full min-h-screen bg-page-bg pb-20' }
})
export class AccountNotificationsComponent implements OnInit {
  public notificationService = inject(NotificationService);
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/account']);
  }
  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.notificationService.loadNotifications(1, 20).subscribe();
    this.notificationService.refreshUnreadCount().subscribe();
  }

  markAllRead(): void {
    if (this.notificationService.unreadCount() <= 0) {
      return;
    }

    this.notificationService.markAllAsRead().subscribe();
  }

  loadMore(): void {
    this.notificationService.loadNextPage().subscribe();
  }

  openNotification(item: NotificationInboxItemResponse): void {
    const route = this.notificationService.resolveNotificationRoute(item);
    if (!item.isRead) {
      this.notificationService.markAsRead(item.id).subscribe();
    }

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