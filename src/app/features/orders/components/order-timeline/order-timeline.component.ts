import { Component, input , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideBox,
  lucideCheck,
  lucideCheckCircle2,
  lucideClipboardList,
  lucideXCircle,
  lucidePackageCheck,
  lucideShoppingBag
} from '@ng-icons/lucide';
import { CustomerOrderTimelineStepReadModel } from '../../../../features/orders/models/order.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-timeline',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({
    lucideBox,
    lucideCheck,
    lucideCheckCircle2,
    lucideClipboardList,
    lucideXCircle,
    lucidePackageCheck,
    lucideShoppingBag
  })],
  templateUrl: './order-timeline.component.html'
})
export class OrderTimeline {
  steps = input.required<readonly CustomerOrderTimelineStepReadModel[]>();

  isCompleted(state: string): boolean {
    return state === 'COMPLETED';
  }

  isCurrent(state: string): boolean {
    return state === 'CURRENT';
  }

  isError(state: string): boolean {
    return state === 'ERROR' || state === 'CANCELLED';
  }

  isPending(state: string): boolean {
    return state === 'PENDING';
  }
}
