import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-strip',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="px-4 py-6 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl lg:text-2xl font-bold text-brand-black tracking-tight">Shop by Category</h3>
        <a routerLink="/categories" class="text-brand-orange font-semibold text-sm lg:text-base hover:underline">View all</a>
      </div>

      <div class="flex overflow-x-auto lg:flex-wrap lg:justify-center gap-4 lg:gap-12 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
        
        <!-- Category Item (Mockup) -->
        <a href="#" class="flex flex-col items-center gap-3 min-w-[80px] lg:min-w-[100px] lg:min-w-[120px] group snap-start">
          <div class="w-20 h-20 lg:w-24 lg:h-24 lg:w-32 lg:h-32 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center p-3 lg:p-5 group-hover:shadow-md transition-shadow group-hover:scale-105 transform duration-300">
            <!-- Using unsplash image as placeholder for apparel -->
            <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop" alt="Apparel" class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
          <span class="text-xs lg:text-sm lg:text-base font-semibold text-brand-black">Apparel</span>
        </a>

        <a href="#" class="flex flex-col items-center gap-3 min-w-[80px] lg:min-w-[100px] lg:min-w-[120px] group snap-start">
          <div class="w-20 h-20 lg:w-24 lg:h-24 lg:w-32 lg:h-32 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center p-3 lg:p-5 group-hover:shadow-md transition-shadow group-hover:scale-105 transform duration-300">
            <img src="https://images.unsplash.com/photo-1556306535-0f09a536f01f?w=200&h=200&fit=crop" alt="Headwear" class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
          <span class="text-xs lg:text-sm lg:text-base font-semibold text-brand-black">Headwear</span>
        </a>

        <a href="#" class="flex flex-col items-center gap-3 min-w-[80px] lg:min-w-[100px] lg:min-w-[120px] group snap-start">
          <div class="w-20 h-20 lg:w-24 lg:h-24 lg:w-32 lg:h-32 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center p-3 lg:p-5 group-hover:shadow-md transition-shadow group-hover:scale-105 transform duration-300">
            <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop" alt="Accessories" class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
          <span class="text-xs lg:text-sm lg:text-base font-semibold text-brand-black">Accessories</span>
        </a>

        <a href="#" class="flex flex-col items-center gap-3 min-w-[80px] lg:min-w-[100px] lg:min-w-[120px] group snap-start">
          <div class="w-20 h-20 lg:w-24 lg:h-24 lg:w-32 lg:h-32 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center p-3 lg:p-5 group-hover:shadow-md transition-shadow group-hover:scale-105 transform duration-300">
            <img src="https://images.unsplash.com/photo-1614666407481-9b16fc8bfa46?w=200&h=200&fit=crop" alt="Equipment" class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
          <span class="text-xs lg:text-sm lg:text-base font-semibold text-brand-black">Equipment</span>
        </a>

        <a href="#" class="flex flex-col items-center gap-3 min-w-[80px] lg:min-w-[100px] lg:min-w-[120px] group snap-start">
          <div class="w-20 h-20 lg:w-24 lg:h-24 lg:w-32 lg:h-32 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center p-3 lg:p-5 group-hover:shadow-md transition-shadow group-hover:scale-105 transform duration-300">
            <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop" alt="Gifts" class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
          <span class="text-xs lg:text-sm lg:text-base font-semibold text-brand-black">Gifts & More</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class CategoryStrip {}
