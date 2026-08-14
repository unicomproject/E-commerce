import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-category-card',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NgIconComponent],
  templateUrl: './category-card.component.html',
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  layout = input<'grid' | 'list' | 'subcategory'>('grid');
}
