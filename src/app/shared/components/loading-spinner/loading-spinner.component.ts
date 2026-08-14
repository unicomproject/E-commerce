import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
})
export class LoadingSpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly message = input<string | undefined>();
  readonly containerClass = input('h-32');

  readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'h-5 w-5';
      case 'lg':
        return 'h-10 w-10';
      case 'md':
      default:
        return 'h-8 w-8';
    }
  });
}
