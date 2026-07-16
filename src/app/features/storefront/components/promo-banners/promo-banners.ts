import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShoppingBag, lucideTruck, lucideArrowRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-promo-banners',
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideShoppingBag, lucideTruck, lucideArrowRight })],
  template: `
    <div class="px-4 py-4 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        
        <!-- Click & Collect Banner -->
        <a href="#" class="bg-brand-orange-light rounded-2xl p-5 lg:p-8 flex flex-row items-center justify-between gap-4 group cursor-pointer border border-transparent hover:border-brand-orange/20 transition-all hover:shadow-md">
          <div class="flex-1 z-10 relative">
            <div class="flex items-center gap-1.5 lg:gap-2 text-brand-orange font-bold text-[10px] lg:text-xs lg:text-sm tracking-wider uppercase mb-2">
              <ng-icon name="lucideShoppingBag"></ng-icon>
              <span>Click & Collect</span>
            </div>
            <h3 class="text-base lg:text-2xl lg:text-3xl font-extrabold text-brand-black leading-tight mb-1 lg:mb-2 lg:mb-4">
              Collect in<br/>as little as<br/>30 mins
            </h3>
            <p class="hidden lg:block text-neutral-500 text-xs lg:text-sm mb-4 lg:mb-6">Fast. Easy. Contactless.</p>
            <div class="mt-2 lg:mt-0 flex items-center gap-1.5 lg:gap-2 font-bold text-[10px] lg:text-sm lg:text-base text-brand-black group-hover:text-brand-orange transition-colors">
              <span>SHOP NOW</span>
              <ng-icon name="lucideArrowRight" class="group-hover:translate-x-1 transition-transform"></ng-icon>
            </div>
          </div>
          <div class="relative w-24 h-24 lg:w-32 lg:h-32 lg:w-48 lg:h-48 flex-shrink-0 transition-transform transform group-hover:scale-105 duration-300 rounded-xl overflow-hidden shadow-sm border border-black/5">
            <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=400&fit=crop" alt="Shopping Bag" class="w-full h-full object-cover group-hover:opacity-100" />
          </div>
        </a>

        <!-- Free Delivery Banner -->
        <a href="#" class="bg-brand-orange-light rounded-2xl p-5 lg:p-8 flex flex-row items-center justify-between gap-4 group cursor-pointer border border-transparent hover:border-brand-orange/20 transition-all hover:shadow-md">
          <div class="flex-1 z-10 relative">
            <div class="flex items-center gap-1.5 lg:gap-2 text-brand-orange font-bold text-[10px] lg:text-xs lg:text-sm tracking-wider uppercase mb-2">
              <ng-icon name="lucideTruck"></ng-icon>
              <span>Free Delivery</span>
            </div>
            <h3 class="text-base lg:text-2xl lg:text-3xl font-extrabold text-brand-black leading-tight mb-1 lg:mb-2 lg:mb-4">
              Free delivery<br/>on orders<br/>over $99
            </h3>
            <p class="hidden lg:block text-neutral-500 text-xs lg:text-sm mb-4 lg:mb-6">Available on selected items.</p>
            <div class="mt-2 lg:mt-0 flex items-center gap-1.5 lg:gap-2 font-bold text-[10px] lg:text-sm lg:text-base text-brand-black group-hover:text-brand-orange transition-colors">
              <span>SHOP NOW</span>
              <ng-icon name="lucideArrowRight" class="group-hover:translate-x-1 transition-transform"></ng-icon>
            </div>
          </div>
          <div class="relative w-24 h-24 lg:w-32 lg:h-32 lg:w-48 lg:h-48 flex-shrink-0 transition-transform transform group-hover:scale-105 duration-300 rounded-xl overflow-hidden shadow-sm border border-black/5">
            <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop" alt="Gift Box" class="w-full h-full object-cover group-hover:opacity-100" />
          </div>
        </a>

      </div>
    </div>
  `
})
export class PromoBanners {}
