import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-card.component.html'
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  readonly layout = input<'list' | 'grid'>('grid');
}