import { Component, HostListener, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { BreadcrumbsComponent, BreadcrumbItem } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, NgIconComponent, BreadcrumbsComponent],
  viewProviders: [provideIcons({ lucideArrowLeft })],
  template: `
    <div class="sticky z-40 px-4 lg:px-8 pt-6 pb-4 bg-page-bg w-full max-w-[1600px] mx-auto flex items-center gap-4 transition-all duration-300" 
         [style.top.px]="isNavbarHidden() ? 0 : 80"
         [ngClass]="customClasses()">
      <button *ngIf="showBack()" (click)="onBack()" class="flex-shrink-0 w-10 h-10 flex lg:hidden items-center justify-center bg-white rounded-2xl shadow-sm text-brand-navy hover:bg-neutral-50 border border-neutral-100 transition-colors">
        <ng-icon name="lucideArrowLeft" size="22" strokeWidth="1.5"></ng-icon>
      </button>
      <div class="flex-grow flex flex-col justify-center">
        <div class="hidden lg:block mb-1" *ngIf="breadcrumbs()">
          <app-breadcrumbs [items]="breadcrumbs()!"></app-breadcrumbs>
        </div>
        <h1 *ngIf="title()" class="text-2xl lg:text-3xl font-bold text-brand-navy tracking-tight flex lg:hidden items-center gap-2">
          <ng-content></ng-content>
          <span>{{ title() }}</span>
        </h1>
        <h1 *ngIf="title() && !hideDesktopTitle()" class="hidden lg:flex text-3xl font-bold text-brand-navy tracking-tight items-center gap-2">
          <ng-content></ng-content>
          <span>{{ title() }}</span>
        </h1>
        <p *ngIf="subtitle()" class="text-gray-500 text-sm lg:text-base mt-1">{{ subtitle() }}</p>
        <div *ngIf="!title()" class="flex items-center gap-2">
          <ng-content></ng-content>
        </div>
      </div>
      <!-- Optional Actions Slot -->
      <div class="flex-shrink-0">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  readonly title = input('');
  readonly subtitle = input('');
  readonly showBack = input(true);
  readonly hideDesktopTitle = input(false);
  readonly customClasses = input('');
  readonly breadcrumbs = input<BreadcrumbItem[]>();
  readonly back = output<void>();

  readonly isNavbarHidden = signal(false);
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    this.isNavbarHidden.set(currentScroll > this.lastScrollTop && currentScroll > 60);
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  onBack() {
    this.back.emit();
    history.back();
  }
}