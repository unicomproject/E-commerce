import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-4" [ngClass]="containerClass()">
      <div 
        class="animate-spin rounded-full border-b-2 border-brand-orange"
        [ngClass]="sizeClass()">
      </div>
      <p *ngIf="message()" class="mt-4 text-sm text-neutral-500">{{ message() }}</p>
    </div>
  `
})
export class LoadingSpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly message = input<string | undefined>();
  readonly containerClass = input('h-32');

  readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm': return 'h-5 w-5';
      case 'lg': return 'h-10 w-10';
      case 'md':
      default: return 'h-8 w-8';
    }
  });
}