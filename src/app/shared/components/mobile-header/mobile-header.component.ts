import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [CommonModule, NgIconComponent, RouterModule],
  viewProviders: [provideIcons({ lucideArrowLeft })],
  template: `
    <!-- Header (Mobile Only) -->
    <div class="lg:hidden pt-4 pb-2 flex items-center gap-2" [class]="customClasses()">
      <button (click)="handleBack()" class="flex-shrink-0 p-1.5 -ml-1.5 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#111111]">
        <ng-icon name="lucideArrowLeft" class="text-[24px]"></ng-icon>
      </button>
      <h1 *ngIf="title()" class="text-[20px] font-bold text-[#111111] leading-none pt-0.5 truncate">{{ title() }}</h1>
      <div *ngIf="hasContent" class="flex-grow flex items-center h-full">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class MobileHeaderComponent {
  title = input<string>();
  backLink = input<string>();
  customClasses = input<string>('');

  hasContent = false;

  constructor(private router: Router) {}

  ngAfterContentInit() {
    this.hasContent = true;
  }

  handleBack() {
    if (this.backLink()) {
      this.router.navigateByUrl(this.backLink()!);
    } else {
      window.history.back();
    }
  }
}
