import { Component, input } from '@angular/core';
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
import { CustomerOrderTimelineStepReadModel } from '../../../../core/models/order.model';

@Component({
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
  templateUrl: './order-timeline.html'
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
