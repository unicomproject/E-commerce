import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-4" [ngClass]="containerClass">
      <div 
        class="animate-spin rounded-full border-b-2 border-brand-orange"
        [ngClass]="sizeClass">
      </div>
      <p *ngIf="message" class="mt-4 text-sm text-neutral-500">{{ message }}</p>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
  @Input() containerClass: string = 'h-32';

  get sizeClass(): string {
    switch (this.size) {
      case 'sm': return 'h-5 w-5';
      case 'lg': return 'h-10 w-10';
      case 'md':
      default: return 'h-8 w-8';
    }
  }
}
