import { Component, Input } from '@angular/core';
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
  @Input() category!: Category;
  @Input() layout: 'list' | 'grid' = 'grid';
}
