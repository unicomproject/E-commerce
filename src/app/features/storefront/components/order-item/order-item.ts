import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePackage } from '@ng-icons/lucide';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  template: `
    <div class="flex items-center gap-4 py-2" [class.border-b]="!isLast()" [class.border-neutral-100]="!isLast()">
      <!-- Image -->
      <div class="h-16 w-16 md:h-20 md:w-20 rounded-lg bg-neutral-50 border border-neutral-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
        @if (item().imageUrl) {
          <img [src]="item().imageUrl" [alt]="item().productName" class="h-full w-full object-cover mix-blend-multiply" />
        } @else {
          <ng-icon name="lucidePackage" class="text-2xl text-neutral-300"></ng-icon>
        }
      </div>
      
      <!-- Info -->
      <div class="flex-grow">
        <h4 class="font-bold text-brand-navy text-sm md:text-base leading-tight">{{ item().productName }}</h4>
        @if (item().variantName) {
          <p class="text-xs text-neutral-500 mt-1">{{ item().variantName }}</p>
        }
      </div>
      
      <!-- Qty & Price -->
      <div class="text-right flex items-center gap-4 md:gap-8 flex-shrink-0">
        <div class="text-sm text-neutral-500">Qty: {{ item().quantity }}</div>
        <div class="font-bold text-brand-navy min-w-fit whitespace-nowrap text-right">{{ currencyCode() === 'GBP' ? '£' : '$' }}{{ item().lineTotal | number:'1.2-2' }}</div>
      </div>
    </div>
  `,
  viewProviders: [provideIcons({ lucidePackage })]
})
export class OrderItem {
  item = input.required<any>();
  isLast = input<boolean>(false);
  currencyCode = input<string>('$');
}
