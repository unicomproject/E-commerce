import { Component, OnInit, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideClock, lucideCheckCircle2, lucideSettings, lucidePackageCheck, lucideCheckSquare, lucideXCircle, lucideCopy, lucideDownload, lucideHelpCircle, lucideTruck, lucideCalendar, lucideMapPin, lucideCreditCard, lucideFileText, lucideChevronDown, lucideChevronUp, lucideArrowLeft } from '@ng-icons/lucide';
import { OrderService } from '../../../../core/services/order.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { OrderItem } from '../../components/order-item/order-item';
import { OrderTimeline } from '../../components/order-timeline/order-timeline';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, QRCodeComponent, OrderItem, OrderTimeline],
  viewProviders: [provideIcons({ lucideClock, lucideCheckCircle2, lucideSettings, lucidePackageCheck, lucideCheckSquare, lucideXCircle, lucideCopy, lucideDownload, lucideHelpCircle, lucideTruck, lucideCalendar, lucideMapPin, lucideCreditCard, lucideFileText, lucideChevronDown, lucideChevronUp, lucideArrowLeft })],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
  host: { class: 'block w-full min-h-screen bg-brand-gray pb-20' }
})
export class OrderDetails implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  // Expose signals
  orderData = this.orderService.orderDetail;
  isLoading = this.orderService.orderDetailLoading;
  showAllItems = signal(false);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderDetails(orderId).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.orderService.clearOrderDetail();
  }

  copyOrderId(id: string): void {
    navigator.clipboard.writeText(id).then(() => {
      // Could show a toast here
    });
  }

  toggleItems(): void {
    this.showAllItems.update(val => !val);
  }

  downloadQr(): void {
    // Logic to download QR code image
  }

  showCancelModal = signal(false);
  isCancelling = signal(false);

  promptCancelOrder(): void {
    this.showCancelModal.set(true);
  }

  closeCancelModal(): void {
    this.showCancelModal.set(false);
  }

  confirmCancelOrder(): void {
    const order = this.orderData();
    if (!order || !order.id) return;
    
    this.isCancelling.set(true);
    this.orderService.cancelOrder(order.id, 'Customer requested cancellation').subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.showCancelModal.set(false);
        // Refresh order details after cancellation
        this.orderService.getOrderDetails(order.id).subscribe();
      },
      error: (err: any) => {
        this.isCancelling.set(false);
        this.showCancelModal.set(false);
        console.error('Failed to cancel order', err);
        // We can show a nicer error toast later, for now we will just use alert for errors
        alert('Failed to cancel order. Please try again.');
      }
    });
  }

  /**
   * Helper to format status banner colors dynamically
   */
  getStatusBannerClasses(status: string): string {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return 'bg-orange-50 border-orange-200 text-brand-orange';
      case 'ACCEPTED':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'PREPARING':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'READY_FOR_COLLECTION':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'COMPLETED':
        return 'bg-neutral-100 border-neutral-200 text-neutral-700';
      case 'CANCELLED':
        return 'bg-red-50 border-red-200 text-red-600';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-600';
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
  hasAction(action: string): boolean {
    return this.orderData()?.availableActions?.includes(action) ?? false;
  }
}
