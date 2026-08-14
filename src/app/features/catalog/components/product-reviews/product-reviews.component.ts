import { Component, input, output, signal , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  lucideStar,
  lucideChevronDown,
  lucidePenSquare,
  lucideMoreVertical,
  lucideCheck
} from '@ng-icons/lucide';
import { ProductReviewsPageReadModel } from '../../../../core/models';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, NgIconComponent, StarRatingComponent, DatePipe],
  templateUrl: './product-reviews.component.html',
  viewProviders: [provideIcons({ 
    lucideStar,
    lucideChevronDown,
    lucidePenSquare,
    lucideMoreVertical,
    lucideCheck
  })]
})
export class ProductReviewsComponent {
  readonly reviewsData = input.required<ProductReviewsPageReadModel>();
  
  readonly activeSort = input<string>('newest');
  readonly activeRating = input<number | null>(null);
  
  readonly onFilterChange = output<{ sort: string, rating: number | null }>();

  sortDropdownOpen = signal(false);
  ratingDropdownOpen = signal(false);

  sortOptions = [
    { value: 'newest', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' }
  ];

  ratingOptions = [
    { value: null, label: 'All Stars' },
    { value: 5, label: '5 Star' },
    { value: 4, label: '4 Star' },
    { value: 3, label: '3 Star' },
    { value: 2, label: '2 Star' },
    { value: 1, label: '1 Star' }
  ];

  get activeSortLabel(): string {
    return this.sortOptions.find(o => o.value === this.activeSort())?.label || 'Sort';
  }

  get activeRatingLabel(): string {
    return this.ratingOptions.find(o => o.value === this.activeRating())?.label || 'All Stars';
  }

  getPercentage(count: number): number {
    const total = this.reviewsData().summary.totalReviews;
    if (total === 0) return 0;
    return (count / total) * 100;
  }

  toggleSortDropdown() {
    this.sortDropdownOpen.set(!this.sortDropdownOpen());
    this.ratingDropdownOpen.set(false);
  }

  toggleRatingDropdown() {
    this.ratingDropdownOpen.set(!this.ratingDropdownOpen());
    this.sortDropdownOpen.set(false);
  }

  selectSort(sort: string) {
    this.onFilterChange.emit({ sort, rating: this.activeRating() });
    this.sortDropdownOpen.set(false);
  }

  selectRating(rating: number | null) {
    this.onFilterChange.emit({ sort: this.activeSort(), rating });
    this.ratingDropdownOpen.set(false);
  }
}
