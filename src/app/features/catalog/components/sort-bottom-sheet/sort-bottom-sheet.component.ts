import { Component, ChangeDetectionStrategy, input, output, effect, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideCheck } from '@ng-icons/lucide';
import { BodyScrollLockService } from '../../../../core/services/body-scroll-lock.service';

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
  private bodyScrollLock = inject(BodyScrollLockService);

  readonly isOpen = input(false);
  readonly activeSort = input<SortOption | null>(null);

  readonly close = output<void>();
  readonly sortSelected = output<SortOption>();

  constructor() {
    let wasOpen = false;
    effect(() => {
      const open = this.isOpen();
      if (open && !wasOpen) this.bodyScrollLock.lock();
      if (!open && wasOpen) this.bodyScrollLock.unlock();
      wasOpen = open;
    });
    inject(DestroyRef).onDestroy(() => {
      if (wasOpen) this.bodyScrollLock.unlock();
    });
  }

  onClose() {
    this.close.emit();
  }

  selectSort(sort: SortOption) {
    this.sortSelected.emit(sort);
    this.close.emit();
  }
}
