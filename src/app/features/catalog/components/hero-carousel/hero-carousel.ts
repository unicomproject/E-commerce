import { Component, computed, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Banner } from '../../../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    @if (banners().length > 0 && activeBanner(); as banner) {
      <div class="mb-5 w-full min-w-0 px-0 lg:mb-0">
        <div
          class="relative flex h-[180px] w-full min-w-0 items-center overflow-hidden rounded-2xl bg-brand-dark-grey shadow-sm group cursor-pointer md:h-[320px] lg:h-[300px]"
        >
          <!-- Background Image -->
          <div
            class="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
            [style.background-image]="'url(' + banner.imageUrl + ')'"
          ></div>
          <!-- Subtle Gradient to protect text -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-brand-dark-grey via-brand-dark-grey/70 to-transparent pointer-events-none"
          ></div>
          <!-- Desktop Navigation Arrows -->
          <button
            (click)="prev()"
            class="hidden lg:flex absolute left-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0"
          >
            <ng-icon name="lucideChevronLeft" class="text-xl"></ng-icon>
          </button>
          <button
            (click)="next()"
            class="hidden lg:flex absolute right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0"
          >
            <ng-icon name="lucideChevronRight" class="text-xl"></ng-icon>
          </button>
          <!-- Content -->
          @if (
            banner.title ||
            banner.subtitle ||
            banner.description ||
            banner.actionText ||
            banner.buttonText
          ) {
            <div class="relative z-10 px-4 md:px-8 lg:px-12 max-w-[70%] lg:max-w-[50%]">
              @if (banner.subtitle) {
                <p class="text-brand-orange text-[12px] font-medium tracking-widest uppercase mb-1">
                  {{ banner.subtitle }}
                </p>
              }
              @if (banner.title) {
                <h2
                  class="text-white text-[24px] md:text-[32px] lg:text-[48px] lg:leading-[56px] font-extrabold leading-tight mb-1"
                  [innerHTML]="banner.title"
                ></h2>
              }
              @if (banner.description) {
                <p
                  class="text-[#CCCCCC] text-[14px] lg:text-[14px] lg:leading-5 font-normal mb-4 line-clamp-2"
                >
                  {{ banner.description }}
                </p>
              }
              @if (banner.actionText || banner.buttonText) {
                <a
                  [href]="banner.actionUrl || banner.linkUrl || '#'"
                  class="inline-block bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2 px-6 lg:py-2.5 lg:px-6 text-[14px] rounded-lg transition-transform transform active:scale-95 shadow-sm"
                >
                  {{ banner.actionText || banner.buttonText }}
                </a>
              }
            </div>
          }
          <!-- Pagination Dots -->
          <div class="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-[6px]">
            @for (item of banners(); track item; let i = $index) {
              <button
                (click)="setSlide(i)"
                [ngClass]="
                  i === activeIndex()
                    ? 'w-2 h-2 bg-brand-orange'
                    : 'w-2 h-2 bg-neutral-500 hover:bg-neutral-400'
                "
                class="rounded-full transition-all"
              ></button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class HeroCarousel {
  readonly banners = input<Banner[]>([]);
  readonly activeIndex = signal(0);
  readonly activeBanner = computed(() => this.banners()[this.activeIndex()] ?? null);

  next() {
    const banners = this.banners();
    if (banners.length === 0) return;
    this.activeIndex.update((index) => (index + 1) % banners.length);
  }

  prev() {
    const banners = this.banners();
    if (banners.length === 0) return;
    this.activeIndex.update((index) => (index - 1 + banners.length) % banners.length);
  }

  setSlide(index: number) {
    this.activeIndex.set(index);
  }
}
