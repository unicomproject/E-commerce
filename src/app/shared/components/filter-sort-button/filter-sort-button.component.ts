import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSlidersHorizontal } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-filter-sort-button',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ lucideSlidersHorizontal })],
  templateUrl: './filter-sort-button.component.html',
})
export class FilterSortButtonComponent {
  readonly label = input('Filter');
  readonly click = output<MouseEvent>();
}
