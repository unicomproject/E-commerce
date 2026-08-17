import { Component, computed, input, signal, ChangeDetectionStrategy, OnInit, OnDestroy, Inject, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
          (mouseenter)="stopAutoSlide()"
          (mouseleave)="startAutoSlide()"
          class="relative flex h-[180px] w-full min-w-0 items-center overflow-hidden rounded-2xl bg-brand-dark-grey shadow-sm group cursor-pointer md:h-[320px] lg:h-[300px]"
        >
          <!-- Background Image -->
          <img
            [src]="banner.imageUrl"
            [alt]="banner.title || 'Hero Banner'"
            class="absolute inset-0 w-full h-full object-cover"
            fetchpriority="high"
            loading="eager"
          />
          <!-- Darker Gradient to protect text -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none"
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
                <p class="text-brand-orange text-[12px] font-bold tracking-widest uppercase mb-1 drop-shadow-sm">
                  {{ banner.subtitle }}
                </p>
              }
              @if (banner.title) {
                <h2
                  class="text-white drop-shadow-md text-[20px] md:text-[28px] lg:text-[36px] lg:leading-[44px] font-extrabold leading-tight mb-2"
                  [innerHTML]="banner.title"
                ></h2>
              }
              @if (banner.description) {
                <p
                  class="text-[#E0E0E0] drop-shadow-sm text-[13px] lg:text-[14px] lg:leading-5 font-medium mb-3 line-clamp-2"
                >
                  {{ banner.description }}
                </p>
              }
              @if (banner.actionText || banner.buttonText) {
                <a
                  [href]="banner.actionUrl || banner.linkUrl || '#'"
                  class="inline-flex items-center gap-1.5 text-brand-orange hover:text-brand-orange-dark font-extrabold text-[13px] md:text-[14px] uppercase tracking-wider transition-all group drop-shadow-sm mt-1"
                >
                  <span class="border-b-2 border-transparent group-hover:border-brand-orange-dark transition-colors pb-0.5">{{ banner.actionText || banner.buttonText }}</span>
                  <span class="transform transition-transform group-hover:translate-x-1 text-[16px]" aria-hidden="true">&rarr;</span>
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
export class HeroCarousel implements OnInit, OnDestroy {
  readonly banners = input<Banner[]>([]);
  readonly activeIndex = signal(0);
  readonly activeBanner = computed(() => this.banners()[this.activeIndex()] ?? null);

  private intervalId: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Automatically restart sliding if the banners list changes
    effect(() => {
      const b = this.banners();
      if (this.isBrowser && b.length > 1) {
        this.startAutoSlide();
      }
    });
  }

  ngOnInit() {
    // startAutoSlide will be handled by the effect, but we can keep this for safety
    if (this.isBrowser && this.banners().length > 1) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide();
    if (this.isBrowser && this.banners().length > 1) {
      this.intervalId = setInterval(() => {
        this.next();
      }, 5000);
    }
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

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
    this.startAutoSlide(); // Reset timer when manually clicked
  }
}
