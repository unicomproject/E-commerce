import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideHome,
  lucideLayoutGrid,
  lucideSearch,
  lucidePackage,
  lucideUser,
} from '@ng-icons/lucide';

import { RouterModule } from '@angular/router';
import { CategoryModalService } from '../../features/catalog/services/category-modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bottom-nav',
  imports: [NgIcon, RouterModule],
  viewProviders: [
    provideIcons({ lucideHome, lucideLayoutGrid, lucideSearch, lucidePackage, lucideUser }),
  ],
  template: `
    <!-- Mobile Bottom Navigation (Hidden on md and up) -->
    <div
      class="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-neutral-200 z-[49] px-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] transition-transform duration-300 pb-safe"
    >
      <div class="flex justify-between items-center h-16">
        <!-- Home -->
        <a
          routerLink="/"
          routerLinkActive="!text-brand-orange !font-medium"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center justify-center flex-1 text-brand-black/70 font-normal hover:text-brand-orange active:scale-95 transition-all"
        >
          <ng-icon name="lucideHome" class="text-[24px] mb-1"></ng-icon>
          <span class="text-[11px]">Home</span>
        </a>

        <!-- Categories -->
        <a
          routerLink="/categories"
          routerLinkActive="!text-brand-orange !font-medium"
          class="flex flex-col items-center justify-center flex-1 text-brand-black/70 font-normal hover:text-brand-orange active:scale-95 transition-all"
        >
          <ng-icon name="lucideLayoutGrid" class="text-[24px] mb-1"></ng-icon>
          <span class="text-[11px]">Categories</span>
        </a>

        <!-- Search -->
        <a
          routerLink="/search"
          routerLinkActive="!text-brand-orange !font-medium"
          class="flex flex-col items-center justify-center flex-1 text-brand-black/70 font-normal hover:text-brand-orange active:scale-95 transition-all"
        >
          <ng-icon name="lucideSearch" class="text-[24px] mb-1"></ng-icon>
          <span class="text-[11px]">Search</span>
        </a>

        <!-- Orders -->
        <a
          routerLink="/account/orders"
          routerLinkActive="!text-brand-orange !font-medium"
          class="flex flex-col items-center justify-center flex-1 text-brand-black/70 font-normal hover:text-brand-orange active:scale-95 transition-all"
        >
          <ng-icon name="lucidePackage" class="text-[24px] mb-1"></ng-icon>
          <span class="text-[11px]">Orders</span>
        </a>

        <!-- Account -->
        <a
          routerLink="/account"
          routerLinkActive="!text-brand-orange !font-medium"
          class="flex flex-col items-center justify-center flex-1 text-brand-black/70 font-normal hover:text-brand-orange active:scale-95 transition-all"
        >
          <ng-icon name="lucideUser" class="text-[24px] mb-1"></ng-icon>
          <span class="text-[11px]">Account</span>
        </a>
      </div>
    </div>
  `,
})
export class BottomNav {
  private categoryModalService = inject(CategoryModalService);

  openCategories() {
    this.categoryModalService.open();
  }
}
