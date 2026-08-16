import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DEMO_SNEAKER, DEMO_REVIEWS } from '../../../../core/mocks/demo-product.mock';
import { StorefrontDataService } from '../../services/catalog.service';
import { StorefrontProductDetailReadModel, ProductReviewsPageReadModel } from '../../../../core/models';
import { ProductReviewsComponent } from '../../components/product-reviews/product-reviews.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-product-reviews-page',
  standalone: true,
  imports: [CommonModule, ProductReviewsComponent, PageHeaderComponent],
  template: `
    <div class="min-h-screen bg-page-bg pb-20">
      <app-page-header
        [title]="'Reviews'"
        [subtitle]="product()?.name || ''"
        [noPadding]="true"
        [isSticky]="false"
        [isTransparent]="true"
        [customClasses]="'px-4 lg:px-8 pt-2 pb-0'"
        (back)="goBack()"
      ></app-page-header>
      
      <div class="max-w-4xl mx-auto px-4 lg:px-6 mt-2">
        @if (loading()) {
          <div class="flex justify-center p-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          </div>
        } @else if (reviews()) {
          <app-product-reviews
            [reviewsData]="reviews()!"
            [activeSort]="reviewSort()"
            [activeRating]="reviewRating()"
            [isSummaryMode]="false"
            (onFilterChange)="onFilterChange($event)"
          ></app-product-reviews>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviewsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(StorefrontDataService);
  private location = inject(Location);

  product = signal<StorefrontProductDetailReadModel | null>(null);
  reviews = signal<ProductReviewsPageReadModel | null>(null);
  loading = signal(true);
  
  reviewSort = signal<string>('newest');
  reviewRating = signal<number | null>(null);

  slug = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      if (this.slug) {
        this.loadData(this.slug);
      }
    });
  }

  loadData(slug: string) {
    this.loading.set(true);

    const source$ = slug === 'demo-sneaker' 
      ? of(DEMO_SNEAKER).pipe(delay(400))
      : this.dataService.getProductDetail(slug);

    source$.subscribe({
      next: (product) => {
        this.product.set(product);
        this.loadReviews(product.id);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadReviews(productId: string) {
    if (this.slug === 'demo-sneaker') {
      this.reviews.set(DEMO_REVIEWS);
      this.loading.set(false);
      return;
    }

    this.dataService.getProductReviews(
      productId,
      1,
      50,
      this.reviewSort(),
      this.reviewRating()
    ).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onFilterChange(event: { sort: string, rating: number | null }) {
    this.reviewSort.set(event.sort);
    this.reviewRating.set(event.rating);
    const p = this.product();
    if (p) {
      this.loadReviews(p.id);
    }
  }

  goBack() {
    this.location.back();
  }
}
