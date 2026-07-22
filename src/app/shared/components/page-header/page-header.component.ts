import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideArrowLeft })],
  template: `
    <div class="sticky z-40 px-4 lg:px-8 pt-6 pb-4 bg-page-bg w-full max-w-[1600px] mx-auto flex items-center gap-4 transition-all duration-300" 
         [style.top.px]="isNavbarHidden ? 0 : 80"
         [ngClass]="customClasses">
      <button *ngIf="showBack" (click)="onBack()" class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-brand-navy hover:bg-neutral-50 border border-neutral-100 transition-colors">
        <ng-icon name="lucideArrowLeft" size="22" strokeWidth="1.5"></ng-icon>
      </button>
      <h1 *ngIf="title" class="text-2xl lg:text-3xl font-extrabold text-brand-navy tracking-tight flex-grow flex items-center gap-2">
        <ng-content></ng-content>
        <span>{{ title }}</span>
      </h1>
      <div *ngIf="!title" class="flex-grow flex items-center gap-2">
        <ng-content></ng-content>
      </div>
      <!-- Optional Actions Slot -->
      <div class="flex-shrink-0">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() showBack: boolean = true;
  @Input() customClasses: string = '';
  
  @Output() back = new EventEmitter<void>();

  isNavbarHidden = false;
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    
    if (currentScroll > this.lastScrollTop && currentScroll > 60) {
      this.isNavbarHidden = true;
    } else {
      this.isNavbarHidden = false;
    }
    
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  onBack() {
    if (this.back.observed) {
      this.back.emit();
    } else {
      history.back();
    }
  }
}
