import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideStar, lucidePackage, lucideChevronLeft, lucideEdit3, lucideMessageSquare, lucideChevronRight, lucideCheckCircle2, lucideChevronDown, lucideArrowLeft, lucideMoreVertical, lucideCalendar, lucideTruck } from '@ng-icons/lucide';
import { CustomerReviewsService } from '../../../../../core/services/customer-reviews.service';
import { EligibleReviewsPageReadModel, CustomerReviewsPageReadModel } from '../../../../../core/models';
import { StarRatingComponent } from '../../../../../shared/components/star-rating/star-rating.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { Location } from '@angular/common';

type Tab = 'ready' | 'reviewed';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, StarRatingComponent, PageHeaderComponent],
  templateUrl: './reviews.component.html',
  viewProviders: [provideIcons({ lucideStar, lucidePackage, lucideChevronLeft, lucideEdit3, lucideMessageSquare, lucideChevronRight, lucideCheckCircle2, lucideChevronDown, lucideArrowLeft, lucideMoreVertical, lucideCalendar, lucideTruck })]
})
export class ReviewsComponent implements OnInit {
  private reviewsService = inject(CustomerReviewsService);
  private location = inject(Location);

  activeTab = signal<Tab>('ready');
  currentSort = signal<string>('newest');
  isSortDropdownOpen = signal<boolean>(false);



  reviewsData = signal<CustomerReviewsPageReadModel | null>(null);
  eligibleData = signal<EligibleReviewsPageReadModel | null>(null);
  
  isLoadingReviews = signal<boolean>(false);
  isLoadingEligible = signal<boolean>(false);
  
  error = signal<string | null>(null);

  sortOptions = [
    { value: 'newest', label: 'Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' }
  ];

  ngOnInit() {
    this.loadEligibleReviews();
    this.loadReviews();
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  toggleSortDropdown() {
    this.isSortDropdownOpen.update(val => !val);
  }

  selectSort(value: string) {
    this.currentSort.set(value);
    this.isSortDropdownOpen.set(false);
    this.loadReviews(1);
  }

  getSortLabel(): string {
    return this.sortOptions.find(o => o.value === this.currentSort())?.label || 'Recent';
  }

  goBack() {
    this.location.back();
  }

  loadEligibleReviews(page = 1) {
    this.isLoadingEligible.set(true);
    this.error.set(null);
    this.reviewsService.getEligibleReviews(page, 10).subscribe({
      next: (data) => {
        this.eligibleData.set(data);
        this.isLoadingEligible.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load eligible reviews');
        this.isLoadingEligible.set(false);
      }
    });
  }

  loadReviews(page = 1) {
    this.isLoadingReviews.set(true);
    this.error.set(null);
    this.reviewsService.getCustomerReviews(page, 10, this.currentSort()).subscribe({
      next: (data) => {
        this.reviewsData.set(data);
        this.isLoadingReviews.set(false);
        if (this.eligibleData()?.totalCount === 0 && data.totalCount > 0 && this.activeTab() === 'ready') {
            this.activeTab.set('reviewed');
        }
      },
      error: (err) => {
        console.error('Failed to load reviews', err);
        this.error.set('Failed to load your reviews. Please try again later.');
        this.isLoadingReviews.set(false);
      }
    });
  }

  get hasReviews(): boolean {
    const data = this.reviewsData();
    return data !== null && data.items.length > 0;
  }

  get hasEligibleReviews(): boolean {
    const data = this.eligibleData();
    return data !== null && data.items.length > 0;
  }
}
