import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 pt-4 pb-8 w-full mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl lg:text-2xl font-bold tracking-tight text-brand-black">{{ title }}</h3>
        <button class="text-brand-orange text-sm font-bold tracking-wide uppercase hover:text-brand-orange-dark transition-colors">
          View All
        </button>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6">
        <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
      </div>
    </div>
  `
})
export class ProductGrid {
  @Input() title: string = 'Products';
  @Input() products: Product[] = [];
}
