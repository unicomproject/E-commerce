import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideClock, lucideCheckCircle2, lucideSettings, lucidePackageCheck, lucideCheckSquare, lucideXCircle, lucideChevronRight, lucideArrowLeft } from '@ng-icons/lucide';
import { OrderService } from '../../../../core/services/order.service';
import { OrderCard } from '../../components/order-card/order-card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

export interface OrderTab {
  id: string;
  label: string;
  icon?: string;
  colorClass?: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, OrderCard, PageHeaderComponent],
  viewProviders: [provideIcons({ lucideClock, lucideCheckCircle2, lucideSettings, lucidePackageCheck, lucideCheckSquare, lucideXCircle, lucideChevronRight, lucideArrowLeft })],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  host: { class: 'block w-full min-h-screen bg-page-bg pb-20' }
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);

  // Tabs Definition matching the design
  tabs: OrderTab[] = [
    { id: 'all', label: 'All', colorClass: 'bg-brand-orange text-white border-brand-orange' },
    { id: 'pending', label: 'Pending', icon: 'lucideClock', colorClass: 'text-brand-orange border-neutral-200 hover:border-brand-orange/50' },
    { id: 'accepted', label: 'Accepted', icon: 'lucideCheckCircle2', colorClass: 'text-green-600 border-neutral-200 hover:border-green-600/50' },
    { id: 'preparing', label: 'Preparing', icon: 'lucideSettings', colorClass: 'text-blue-600 border-neutral-200 hover:border-blue-600/50' },
    { id: 'ready', label: 'Ready', icon: 'lucidePackageCheck', colorClass: 'text-green-700 border-neutral-200 hover:border-green-700/50' },
    { id: 'completed', label: 'Completed', icon: 'lucideCheckSquare', colorClass: 'text-neutral-600 border-neutral-200 hover:border-neutral-600/50' },
    { id: 'cancelled', label: 'Cancelled', icon: 'lucideXCircle', colorClass: 'text-red-500 border-neutral-200 hover:border-red-500/50' }
  ];

  // State Signals
  activeTab = signal<string>('all');
  
  // Expose service signals
  ordersData = this.orderService.ordersList;
  isLoading = this.orderService.ordersLoading;

  ngOnInit(): void {
    this.loadOrders();
  }

  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getOrders(this.activeTab()).subscribe();
  }

  getTabClass(tab: OrderTab): string {
    const isActive = this.activeTab() === tab.id;
    if (!isActive) {
      return 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300';
    }
    
    if (tab.id === 'all') {
      return 'bg-brand-orange text-white border-brand-orange';
    }

    if (tab.colorClass) {
      const textColor = tab.colorClass.split(' ')[0];
      const bgModifier = textColor.replace('text-', 'bg-') + '/10';
      return `${bgModifier} ${tab.colorClass}`;
    }
    
    return 'bg-neutral-100 text-neutral-800 border-neutral-300';
  }
}
