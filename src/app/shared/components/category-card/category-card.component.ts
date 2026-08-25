import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { LazyMediaImageComponent } from '../lazy-media-image/lazy-media-image.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-category-card',
  standalone: true,
  imports: [LazyMediaImageComponent, RouterLink, NgIconComponent],
  templateUrl: './category-card.component.html',
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  layout = input<'grid' | 'list' | 'subcategory'>('grid');
}
