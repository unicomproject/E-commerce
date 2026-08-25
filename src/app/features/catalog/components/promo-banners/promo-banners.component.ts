import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { Banner } from '../../../../core/models';
import { LazyMediaImageComponent } from '../../../../shared/components/lazy-media-image/lazy-media-image.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-promo-banners',
  standalone: true,
  imports: [NgIcon, LazyMediaImageComponent],
  viewProviders: [provideIcons({ lucideArrowRight })],
  template: `
    @if (banners().length > 0) {
      <div class="w-full min-w-0">
        <div class="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
          @for (banner of banners().slice(0, 2); track banner) {
            <a
              [href]="banner.actionUrl || banner.linkUrl || '#'"
              class="relative flex h-[130px] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-transparent bg-brand-light-grey p-2 sm:p-4 shadow-sm transition-all hover:border-brand-orange/20 group md:h-[180px] md:p-6 lg:h-[190px] lg:p-5"
            >
              <div class="relative z-10 flex h-full w-[65%] min-w-0 flex-col lg:w-[60%]">
                @if (banner.subtitle) {
                  <div
                    class="mb-1 flex items-center gap-1 text-[9px] font-bold uppercase text-brand-orange sm:text-[12px]"
                  >
                    <span>{{ banner.subtitle }}</span>
                  </div>
                }
                <h3
                  class="mb-1 text-[11px] font-bold leading-tight text-brand-black text-pretty sm:text-[16px] md:mb-2 md:text-[22px] lg:text-[18px] lg:leading-[26px]"
                  [innerHTML]="formatTitle(banner.title)"
                ></h3>
                @if (banner.description) {
                  <p
                    class="mb-1 line-clamp-2 text-[9px] text-brand-gray sm:text-[12px] md:text-[14px] lg:text-[12px] lg:leading-4"
                  >
                    {{ banner.description }}
                  </p>
                }
                <div
                  class="mt-auto flex items-center gap-1 text-[9px] font-bold text-brand-black transition-colors group-hover:text-brand-orange sm:text-[14px]"
                >
                  <span>{{ banner.actionText || banner.buttonText || 'SHOP NOW' }}</span>
                  <span class="flex items-center text-brand-orange">
                    <ng-icon
                      name="lucideArrowRight"
                      class="transition-transform group-hover:translate-x-1"
                      size="12"
                    ></ng-icon>
                  </span>
                </div>
              </div>
              <div
                class="absolute bottom-0 right-0 z-0 h-24 w-24 shrink-0 transition-transform duration-300 group-hover:scale-105 sm:bottom-4 sm:right-4 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:bottom-3 lg:right-3 lg:h-24 lg:w-24 mix-blend-multiply"
              >
                <app-lazy-media-image
                  class="absolute inset-0 block h-full w-full"
                  [src]="banner.imageUrl"
                  [alt]="banner.title"
                  [priority]="true"
                  fit="contain"
                />
              </div>
            </a>
          }
        </div>
      </div>
    }
  `,
})
export class PromoBanners {
  readonly banners = input<Banner[]>([]);

  formatTitle(title: string): string {
    return title ? title.replace(/<br\s*\/?>/gi, ' ') : '';
  }
}
