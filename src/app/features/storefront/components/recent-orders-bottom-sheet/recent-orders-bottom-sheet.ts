import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideClipboardList, lucideChevronRight, lucideCalendar } from '@ng-icons/lucide';
import { RecentOrdersModalService } from '../../../../core/services/recent-orders-modal.service';
import { OrderService } from '../../../../core/services/order.service';
import { CustomerOrderSummaryReadModel } from '../../../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { RouterModule, Router } from '@angular/router';

export type RecentOrderTab = 'all' | 'accepted' | 'preparing' | 'ready';

@Component({
  selector: 'app-recent-orders-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgIconComponent, LoadingSpinnerComponent, RouterModule],
  viewProviders: [provideIcons({ lucideX, lucideClipboardList, lucideChevronRight, lucideCalendar })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-orders-bottom-sheet.html'
})
export class RecentOrdersBottomSheet implements OnInit, OnDestroy {
  public modalService = inject(RecentOrdersModalService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  // Filter tabs
  activeTab = signal<RecentOrderTab>('all');
  
  // Data
  orders = signal<CustomerOrderSummaryReadModel[]>([]);
  isLoading = signal<boolean>(false);
  
  // Timer related
  now = signal<Date>(new Date());
  private timerInterval: any;

  ngOnInit() {
    this.fetchRecentOrders();
    
    // Setup timer to tick every second for countdowns
    this.timerInterval = setInterval(() => {
      this.now.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  close() {
    this.modalService.close();
  }

  onOrderClick(orderId: string) {
    this.close();
    this.router.navigate(['/order', orderId]);
  }

  fetchRecentOrders() {
    this.isLoading.set(true);
    // Fetch first page of orders, no status filter to grab recent ones
    this.orderService.getOrders('all', 1, 20).subscribe({
      next: (res) => {
        // Only keep active statuses for this specific view
        const activeOrders = (res.data?.items || []).filter(o => 
          ['ACCEPTED', 'PREPARING', 'READY'].includes(o.status?.toUpperCase())
        );
        this.orders.set(activeOrders);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  // Derived computed signals for tabs
  acceptedOrders = computed(() => this.orders().filter(o => o.status?.toUpperCase() === 'ACCEPTED'));
  preparingOrders = computed(() => this.orders().filter(o => o.status?.toUpperCase() === 'PREPARING'));
  readyOrders = computed(() => this.orders().filter(o => o.status?.toUpperCase() === 'READY'));

  // The displayed list based on active tab
  displayOrders = computed(() => {
    switch (this.activeTab()) {
      case 'accepted': return this.acceptedOrders();
      case 'preparing': return this.preparingOrders();
      case 'ready': return this.readyOrders();
      default: return this.orders();
    }
  });

  setTab(tab: RecentOrderTab) {
    this.activeTab.set(tab);
  }

  getStatusBadgeClass(status: string): string {
    const s = status?.toUpperCase();
    if (s === 'READY') return 'bg-green-100 text-green-700';
    if (s === 'PREPARING') return 'bg-purple-100 text-purple-700';
    if (s === 'ACCEPTED') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  }

  getStatusLabel(status: string, defaultLabel: string): string {
    const s = status?.toUpperCase();
    if (s === 'READY') return 'Ready for Collection';
    if (s === 'PREPARING') return 'Preparing';
    if (s === 'ACCEPTED') return 'Confirmed';
    return defaultLabel || status;
  }

  // Timer calculation
  getCountdownParts(targetDateStr: string | null): { hours: string, mins: string, secs: string } | null {
    if (!targetDateStr) return null;
    
    const targetDate = new Date(targetDateStr).getTime();
    const currentTime = this.now().getTime();
    
    // If target date is in the past, return 00:00:00
    if (targetDate <= currentTime) {
      return { hours: '00', mins: '00', secs: '00' };
    }
    
    const diff = targetDate - currentTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    return {
      hours: hours.toString().padStart(2, '0'),
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0')
    };
  }
}
