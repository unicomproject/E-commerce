import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Banner } from '../../../../core/models';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <div class="px-4 py-6 w-full mx-auto" *ngIf="banners && banners.length > 0">
      <div class="relative bg-brand-black rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[16/9] lg:aspect-[24/9] flex items-center group cursor-pointer">
        <!-- Background Image -->
        <div class="absolute inset-0 w-full h-full opacity-60 mix-blend-screen bg-right bg-no-repeat bg-cover lg:bg-contain" [style.background-image]="'url(' + banners[activeIndex].imageUrl + ')'"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/90 to-transparent"></div>

        <!-- Desktop Navigation Arrows -->
        <button (click)="prev()" class="hidden lg:flex absolute left-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0">
          <ng-icon name="lucideChevronLeft" class="text-xl"></ng-icon>
        </button>
        <button (click)="next()" class="hidden lg:flex absolute right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
          <ng-icon name="lucideChevronRight" class="text-xl"></ng-icon>
        </button>

        <!-- Content -->
        <div class="relative z-10 px-6 lg:px-12 lg:px-20 max-w-lg lg:max-w-2xl">
          <p *ngIf="banners[activeIndex].subtitle" class="text-brand-orange text-xs lg:text-sm lg:text-base font-bold tracking-widest uppercase mb-2 lg:mb-4">{{ banners[activeIndex].subtitle }}</p>
          <h2 class="text-white text-3xl lg:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 lg:mb-6 tracking-tight" [innerHTML]="banners[activeIndex].title">
          </h2>
          <p *ngIf="banners[activeIndex].description" class="text-neutral-300 text-sm lg:text-base lg:text-lg mb-8 max-w-xs lg:max-w-md">
            {{ banners[activeIndex].description }}
          </p>
          <a [href]="banners[activeIndex].linkUrl || '#'" class="inline-block bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-8 lg:py-4 lg:px-10 lg:text-lg rounded-lg transition-transform transform active:scale-95 shadow-lg shadow-brand-orange/30">
            {{ banners[activeIndex].buttonText || 'SHOP NOW' }}
          </a>
        </div>

        <!-- Pagination Dots -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
          <button *ngFor="let banner of banners; let i = index" 
                  (click)="setSlide(i)"
                  [ngClass]="i === activeIndex ? 'w-2.5 h-2.5 lg:w-3 lg:h-3 bg-brand-orange scale-110' : 'w-2 h-2 lg:w-2.5 lg:h-2.5 bg-neutral-500 hover:bg-neutral-400'"
                  class="rounded-full transition-all"></button>
        </div>
      </div>
    </div>
  `
})
export class HeroCarousel {
  @Input() banners: Banner[] = [];
  activeIndex = 0;

  next() {
    if (this.banners.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.banners.length;
  }

  prev() {
    if (this.banners.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.banners.length) % this.banners.length;
  }

  setSlide(index: number) {
    this.activeIndex = index;
  }
}
