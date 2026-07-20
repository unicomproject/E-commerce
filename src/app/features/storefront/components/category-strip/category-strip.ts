import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../../core/models';

@Component({
  selector: 'app-category-strip',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="px-4 py-6 w-full mx-auto" *ngIf="categories && categories.length > 0">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl lg:text-2xl font-bold text-brand-black tracking-tight">Shop by Category</h3>
        <a routerLink="/categories" class="text-brand-orange font-semibold text-sm lg:text-base hover:underline">View all</a>
      </div>

      <div class="flex overflow-x-auto lg:flex-wrap lg:justify-center gap-4 lg:gap-12 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
        
        <a *ngFor="let cat of categories.slice(0, 6)" [routerLink]="['/search']" [queryParams]="{ category: cat.slug }" class="flex flex-col items-center gap-3 min-w-[80px] lg:min-w-[100px] lg:min-w-[120px] group snap-start">
          <div class="w-20 h-20 lg:w-24 lg:h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-white shadow-sm border border-neutral-100 flex items-center justify-center group-hover:shadow-md transition-shadow group-hover:scale-105 transform duration-300 relative">
            <img *ngIf="cat.imageUrl" [src]="cat.imageUrl" [alt]="cat.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div *ngIf="!cat.imageUrl" class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 lg:h-10 lg:w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <span class="text-xs lg:text-sm lg:text-base font-semibold text-brand-black">{{ cat.name }}</span>
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
export class CategoryStrip {
  @Input() categories: Category[] = [];
}
