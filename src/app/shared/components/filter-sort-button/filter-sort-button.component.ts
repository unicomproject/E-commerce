import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSlidersHorizontal } from '@ng-icons/lucide';

@Component({
  selector: 'app-filter-sort-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideSlidersHorizontal })],
  template: `
    <button
      type="button"
      (click)="click.emit($event)"
      class="flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:bg-gray-50"
    >
      <ng-icon name="lucideSlidersHorizontal" size="16"></ng-icon>
      {{ label() }}
    </button>
  `
})
export class FilterSortButtonComponent {
  readonly label = input('Filter');
  readonly click = output<MouseEvent>();
}
