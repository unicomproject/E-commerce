import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  lucideStar,
  lucideChevronDown,
  lucidePenSquare,
  lucideMoreVertical
} from '@ng-icons/lucide';
import { ProductReviewsPageReadModel } from '../../../../core/models';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, NgIconComponent, StarRatingComponent, DatePipe],
  templateUrl: './product-reviews.component.html',
  viewProviders: [provideIcons({ 
    lucideStar,
    lucideChevronDown,
    lucidePenSquare,
    lucideMoreVertical
  })]
})
export class ProductReviewsComponent {
  readonly reviewsData = input.required<ProductReviewsPageReadModel>();

  getPercentage(count: number): number {
    const total = this.reviewsData().summary.totalReviews;
    if (total === 0) return 0;
    return (count / total) * 100;
  }
}
