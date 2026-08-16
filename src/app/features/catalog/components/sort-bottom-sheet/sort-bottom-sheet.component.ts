import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideCheck } from '@ng-icons/lucide';

export type SortOption = 'price_asc' | 'price_desc';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sort-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideX, lucideCheck })],
  templateUrl: './sort-bottom-sheet.component.html',
})
export class SortBottomSheetComponent {
  readonly isOpen = input(false);
  readonly activeSort = input<SortOption | null>(null);
  
  readonly close = output<void>();
  readonly sortSelected = output<SortOption>();

  onClose() {
    this.close.emit();
  }

  selectSort(sort: SortOption) {
    this.sortSelected.emit(sort);
    this.close.emit();
  }
}
