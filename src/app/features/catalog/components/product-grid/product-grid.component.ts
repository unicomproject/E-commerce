import { Component, ChangeDetectionStrategy, input } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../features/catalog/models/product.model';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCardComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex w-full min-w-0 flex-col pb-4 lg:pb-0">
      <div class="mb-4 mt-6 flex shrink-0 items-center justify-between gap-3 lg:mt-0 lg:mb-4">
        <h3
          class="min-w-0 text-[18px] font-bold tracking-tight text-[#111111] lg:text-[24px] lg:leading-8"
        >
          {{ title() }}
        </h3>
        <a
          routerLink="/search"
          class="shrink-0 text-[14px] font-bold text-[#FF6A00] hover:underline"
        >
          <span class="lg:hidden">View all</span>
          <span class="hidden lg:inline">View all products →</span>
        </a>
      </div>

      <div class="grid w-full min-w-0 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        @for (product of products(); track product) {
          <app-product-card [product]="product" class="min-w-0" [isPriority]="true"></app-product-card>
        }
      </div>
    </div>
  `,
})
export class ProductGrid {
  readonly title = input('Products');
  readonly products = input<Product[]>([]);
}
