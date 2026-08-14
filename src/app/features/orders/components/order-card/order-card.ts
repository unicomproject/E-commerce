import { Component, input, computed , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideClock, lucideSettings, lucidePackageCheck, lucideCheckSquare, lucideXCircle, lucideCheckCircle2, lucideChevronRight, lucideCalendar, lucideMapPin, lucideShoppingBag, lucideMoreVertical } from '@ng-icons/lucide';
import { CustomerOrderSummaryReadModel } from '../../../../features/orders/models/order.model';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, TenantCurrencyPipe],
  viewProviders: [provideIcons({ lucideClock, lucideSettings, lucidePackageCheck, lucideCheckSquare, lucideXCircle, lucideCheckCircle2, lucideChevronRight, lucideCalendar, lucideMapPin, lucideShoppingBag, lucideMoreVertical })],
  templateUrl: './order-card.html'
})
export class OrderCard {
  // Input Signal for the order data
  order = input.required<CustomerOrderSummaryReadModel>();

  displayThumbnails = computed(() => {
    const urls = this.order().thumbnailUrls || [];
    return urls.slice(0, 2);
  });

  remainingThumbnailsCount = computed(() => {
    const displayed = this.displayThumbnails().length;
    return Math.max(0, (this.order().itemCount || 0) - displayed);
  });

  getStatusPillClasses(status: string): string {
    switch (status) {
      case 'PENDING_CONFIRMATION': return 'bg-orange-50 text-brand-orange border-orange-200';
      case 'ACCEPTED': return 'bg-green-50 text-green-700 border-green-200';
      case 'PREPARING': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'READY_FOR_COLLECTION': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED': return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING_CONFIRMATION': return 'lucideClock';
      case 'ACCEPTED': return 'lucideCheckCircle2';
      case 'PREPARING': return 'lucideSettings';
      case 'READY_FOR_COLLECTION': return 'lucidePackageCheck';
      case 'COMPLETED': return 'lucideCheckSquare';
      case 'CANCELLED': return 'lucideXCircle';
      default: return 'lucideClock';
    }
  }
}
