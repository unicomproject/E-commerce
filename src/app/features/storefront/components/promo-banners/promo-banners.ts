import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShoppingBag, lucideTruck, lucideArrowRight } from '@ng-icons/lucide';
import { Banner } from '../../../../core/models';

@Component({
  selector: 'app-promo-banners',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ lucideShoppingBag, lucideTruck, lucideArrowRight })],
  template: `
    <div class="px-4 py-4 w-full mx-auto" *ngIf="banners && banners.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        
        <a *ngFor="let banner of banners.slice(0, 2)" [href]="banner.linkUrl || '#'" class="bg-brand-orange-light rounded-2xl p-5 md:p-6 lg:p-8 flex flex-row items-center justify-between gap-4 md:gap-6 group cursor-pointer border border-transparent hover:border-brand-orange/20 transition-all hover:shadow-md">
          <div class="flex-1 z-10 relative">
            <div *ngIf="banner.subtitle" class="flex items-center gap-1.5 lg:gap-2 text-brand-orange font-bold text-[10px] md:text-xs lg:text-sm tracking-wider uppercase mb-2">
              <ng-icon *ngIf="banner.subtitle.toLowerCase().includes('delivery')" name="lucideTruck"></ng-icon>
              <ng-icon *ngIf="!banner.subtitle.toLowerCase().includes('delivery')" name="lucideShoppingBag"></ng-icon>
              <span>{{ banner.subtitle }}</span>
            </div>
            <h3 class="text-base md:text-xl lg:text-2xl lg:text-3xl font-extrabold text-brand-black leading-tight mb-1 lg:mb-2 lg:mb-4" [innerHTML]="banner.title">
            </h3>
            <p *ngIf="banner.description" class="text-neutral-500 text-xs md:text-sm mb-4 lg:mb-6">{{ banner.description }}</p>
            <div class="mt-2 lg:mt-0 flex items-center gap-1.5 lg:gap-2 font-bold text-[10px] md:text-xs lg:text-sm lg:text-base text-brand-black group-hover:text-brand-orange transition-colors">
              <span>{{ banner.buttonText || 'SHOP NOW' }}</span>
              <ng-icon name="lucideArrowRight" class="group-hover:translate-x-1 transition-transform"></ng-icon>
            </div>
          </div>
          <div class="relative w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 flex-shrink-0 transition-transform transform group-hover:scale-105 duration-300 rounded-xl overflow-hidden shadow-sm border border-black/5">
            <img [src]="banner.imageUrl" [alt]="banner.title" class="w-full h-full object-cover group-hover:opacity-100" />
          </div>
        </a>

      </div>
    </div>
  `
})
export class PromoBanners {
  @Input() banners: Banner[] = [];
}
