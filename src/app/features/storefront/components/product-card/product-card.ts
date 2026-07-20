import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideStar } from '@ng-icons/lucide';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgIcon, RouterModule],
  viewProviders: [provideIcons({ lucideHeart, lucideStar })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="['/product', product.slug]" class="group flex flex-col cursor-pointer block h-full">
      <!-- Image Container -->
      <div class="relative bg-neutral-100 rounded-xl overflow-hidden aspect-square mb-3">
        <!-- Wishlist Button -->
        <button class="absolute top-3 right-3 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
          <ng-icon name="lucideHeart" class="text-[18px] lg:text-[20px]"></ng-icon>
        </button>
        <!-- Product Image -->
        <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
        
        <!-- Add to Cart Overlay (Desktop Only) -->
        <div class="hidden lg:flex absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-gradient-to-t from-black/50 to-transparent">
          <button class="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2.5 rounded-lg shadow-lg transform active:scale-95 transition-all">
            Add to Cart
          </button>
        </div>
      </div>

      <!-- Product Details -->
      <h4 class="text-sm font-semibold text-brand-black mb-1 line-clamp-2 group-hover:text-brand-orange transition-colors">
        {{ product.name }}
      </h4>
      <p class="text-sm font-bold text-brand-black mb-2">
        {{ product.price | currency:'USD':'symbol':'1.2-2' }}
      </p>

      <!-- Ratings -->
      <div class="flex items-center gap-1.5 mt-auto">
        <div class="flex text-brand-orange text-[10px]">
          <!-- Simple mock star rendering based on rating -->
          <ng-icon name="lucideStar" class="fill-current"></ng-icon>
          <ng-icon name="lucideStar" class="fill-current"></ng-icon>
          <ng-icon name="lucideStar" class="fill-current"></ng-icon>
          <ng-icon name="lucideStar" class="fill-current"></ng-icon>
          <ng-icon name="lucideStar" [class.fill-current]="product.rating === 5"></ng-icon>
        </div>
        <span class="text-xs text-neutral-500 font-medium">({{ product.rating ? 12 : 0 }})</span>
      </div>
    </a>
  `
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
}
