import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 py-8 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl lg:text-2xl font-bold tracking-tight text-brand-black">{{ title }}</h3>
        <button class="text-brand-orange text-sm font-bold tracking-wide uppercase hover:text-brand-orange-dark transition-colors">
          View All
        </button>
      </div>
      
      <div class="grid grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6">
        <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
      </div>
    </div>
  `
})
export class ProductGrid {
  @Input() title: string = 'Products';
  @Input() products: Product[] = [];
}
