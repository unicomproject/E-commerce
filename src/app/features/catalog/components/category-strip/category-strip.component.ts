import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../../core/models';
import { LazyMediaImageComponent } from '../../../../shared/components/lazy-media-image/lazy-media-image.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-category-strip',
  standalone: true,
  imports: [CommonModule, RouterModule, LazyMediaImageComponent],
  template: `
    @if (categories().length > 0) {
      <div class="w-full min-w-0">
        <div class="mb-4 mt-2 flex items-center justify-between gap-3 lg:mt-0">
          <h3
            class="min-w-0 text-[18px] font-bold tracking-tight text-brand-black lg:text-[24px] lg:leading-8"
          >
            Shop by Category
          </h3>
          <a
            routerLink="/categories"
            class="shrink-0 text-[14px] font-bold text-brand-orange hover:underline"
          >
            <span class="lg:hidden">View all</span>
            <span class="hidden lg:inline">View all categories →</span>
          </a>
        </div>
        <!-- Always allow horizontal scroll inside strip — never expand page width -->
        <div class="grid grid-cols-5 gap-1 px-1 pb-2 pt-2 md:flex md:gap-4 md:overflow-x-auto md:hide-scrollbar md:px-0 lg:gap-6 lg:pb-0 lg:pt-0">
          @for (cat of categories().slice(0, 6); track cat; let i = $index) {
            <a
              [routerLink]="['/search']"
              [queryParams]="{ category: cat.slug }"
              [ngClass]="i >= 5 ? 'hidden md:flex' : 'flex'"
              class="group flex w-full flex-col items-center md:w-[100px] md:flex-shrink-0 lg:w-[96px]"
            >
              <div
                class="relative flex aspect-square w-full max-w-[64px] items-center justify-center overflow-hidden rounded-full bg-brand-light-grey transition-transform duration-300 group-hover:scale-105 md:h-[90px] md:w-[90px] md:max-w-none lg:h-[96px] lg:w-[96px]"
              >
                @if (cat.imageUrl) {
                  <app-lazy-media-image
                    class="absolute inset-0 block h-full w-full"
                    [src]="cat.imageUrl"
                    [alt]="cat.name"
                    [priority]="true"
                  />
                }
                @if (!cat.imageUrl) {
                  <div
                    class="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400 transition-transform duration-300 group-hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-8 w-8 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                }
              </div>
              <span
                class="mt-1 w-full truncate text-center text-[10px] font-medium leading-tight text-brand-black md:mt-2 md:text-[14px] md:tracking-normal lg:text-[12px] lg:leading-4"
              >
                {{ cat.name }}
              </span>
            </a>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ],
})
export class CategoryStrip {
  readonly categories = input<Category[]>([]);
}

