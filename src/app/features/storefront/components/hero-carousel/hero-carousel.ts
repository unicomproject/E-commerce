import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-hero-carousel',
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <div class="px-4 py-6 max-w-7xl mx-auto">
      <div class="relative bg-brand-black rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-[21/9] lg:aspect-[24/9] flex items-center group cursor-pointer">
        <!-- Background Image (Mockup for now) -->
        <div class="absolute inset-0 w-full h-full opacity-60 mix-blend-screen bg-right bg-no-repeat bg-cover lg:bg-contain" style="background-image: url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop');"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/90 to-transparent"></div>

        <!-- Desktop Navigation Arrows -->
        <button class="hidden lg:flex absolute left-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0">
          <ng-icon name="lucideChevronLeft" class="text-xl"></ng-icon>
        </button>
        <button class="hidden lg:flex absolute right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
          <ng-icon name="lucideChevronRight" class="text-xl"></ng-icon>
        </button>

        <!-- Content -->
        <div class="relative z-10 px-6 lg:px-12 lg:px-20 max-w-lg lg:max-w-2xl">
          <p class="text-brand-orange text-xs lg:text-sm lg:text-base font-bold tracking-widest uppercase mb-2 lg:mb-4">Official Merch</p>
          <h2 class="text-white text-3xl lg:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 lg:mb-6 tracking-tight">
            Gear up.<br/>Rep your team.
          </h2>
          <p class="text-neutral-300 text-sm lg:text-base lg:text-lg mb-8 max-w-xs lg:max-w-md">
            Official merch. Exclusive styles. Made for real fans.
          </p>
          <button class="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-8 lg:py-4 lg:px-10 lg:text-lg rounded-lg transition-transform transform active:scale-95 shadow-lg shadow-brand-orange/30">
            SHOP NOW
          </button>
        </div>

        <!-- Pagination Dots -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
          <button class="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-brand-orange transition-all scale-110"></button>
          <button class="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-neutral-500 hover:bg-neutral-400 transition-all"></button>
          <button class="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-neutral-500 hover:bg-neutral-400 transition-all"></button>
          <button class="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-neutral-500 hover:bg-neutral-400 transition-all"></button>
        </div>
      </div>
    </div>
  `
})
export class HeroCarousel {}
