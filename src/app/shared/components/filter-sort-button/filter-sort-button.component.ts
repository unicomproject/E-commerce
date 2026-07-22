import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSlidersHorizontal } from '@ng-icons/lucide';

@Component({
  selector: 'app-filter-sort-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideSlidersHorizontal })],
  template: `
    <button (click)="click.emit($event)" class="flex items-center justify-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-50 transition-colors shrink-0 whitespace-nowrap">
      <ng-icon name="lucideSlidersHorizontal" size="16"></ng-icon>
      Filter & Sort
    </button>
  `
})
export class FilterSortButtonComponent {
  @Output() click = new EventEmitter<MouseEvent>();
}
