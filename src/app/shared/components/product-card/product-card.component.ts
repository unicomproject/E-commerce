import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart } from '@ng-icons/lucide';
import { StorefrontProductListReadModel } from '../../../core/models';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent, NgIconComponent],
  viewProviders: [provideIcons({ lucideHeart })],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: StorefrontProductListReadModel;
}
