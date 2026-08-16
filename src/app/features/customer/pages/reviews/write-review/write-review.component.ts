import { MobileHeaderComponent } from '../../../../../shared/components/mobile-header/mobile-header.component';
import { Component, OnInit, inject, signal, computed , ChangeDetectionStrategy } from '@angular/core';
import {  CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideStar, lucidePackage, lucideCheckCircle2, lucideCamera, lucideUploadCloud, lucideX, lucideThumbsUp, lucideThumbsDown, lucideEdit3, lucideSparkles, lucidePencil, lucideShieldCheck, lucideTruck, lucideHeadphones, lucideInfo } from '@ng-icons/lucide';
import { CustomerReviewsService } from '../../../services/customer-reviews.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { StorefrontDataService } from '../../../../../features/catalog/services/catalog.service';
import { StorefrontProductDetailReadModel } from '../../../../../core/models';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-write-review',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgIconComponent, MobileHeaderComponent],
  templateUrl: './write-review.component.html',
  viewProviders: [provideIcons({ lucideArrowLeft, lucideStar, lucidePackage, lucideCheckCircle2, lucideCamera, lucideUploadCloud, lucideX, lucideThumbsUp, lucideThumbsDown, lucideEdit3, lucideSparkles, lucidePencil, lucideShieldCheck, lucideTruck, lucideHeadphones, lucideInfo })]
})
export class WriteReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reviewsService = inject(CustomerReviewsService);
  private toastService = inject(ToastService);
  private storefrontDataService = inject(StorefrontDataService);

  goBack() {
    this.router.navigate(['/account/reviews']);
  }

  productId = signal<string>('');
  product = signal<StorefrontProductDetailReadModel | null>(null);
  

  
  rating = signal<number>(0);
  reviewText = signal<string>('');
  isRecommended = signal<boolean | null>(null);
  photos = signal<{ url: string; file?: File }[]>([]);
  
  isLoadingProduct = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  error = signal<string | null>(null);

  ratingLabel = computed(() => {
    switch (this.rating()) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  });

  reviewId = signal<string | null>(null);
  isEditMode = signal<boolean>(false);

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('productId');
    const reviewId = this.route.snapshot.paramMap.get('reviewId');

    if (reviewId) {
      this.isEditMode.set(true);
      this.reviewId.set(reviewId);
      
      const state = history.state;
      if (state && state.review) {
        const review = state.review;
        this.productId.set(review.productId);
        this.rating.set(review.ratingValue || 0);
        this.reviewText.set(review.reviewText || '');
        this.isRecommended.set(review.isRecommended || null);
        this.loadProduct(review.productId);
      } else {
        this.error.set('Review details not found. Please return to your reviews list.');
        this.isLoadingProduct.set(false);
      }
    } else if (productId) {
      this.productId.set(productId);
      this.loadProduct(productId);
    } else {
      this.error.set('Product not found.');
      this.isLoadingProduct.set(false);
    }
  }

  loadProduct(id: string) {
    this.isLoadingProduct.set(true);
    this.storefrontDataService.getProductDetail(id).subscribe({
      next: (data: StorefrontProductDetailReadModel) => {
        this.product.set(data);
        this.isLoadingProduct.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load product', err);
        this.error.set('Failed to load product details.');
        this.isLoadingProduct.set(false);
      }
    });
  }

  setRating(value: number) {
    this.rating.set(value);
  }

  setRecommended(value: boolean) {
    this.isRecommended.set(value);
  }

  removePhoto(index: number) {
    const current = this.photos();
    current.splice(index, 1);
    this.photos.set([...current]);
  }

  onPhotoSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (this.photos().length >= 5) {
        this.toastService.error('You can only add up to 5 photos.');
        return;
      }
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photos.set([...this.photos(), { url: e.target.result, file }]);
      };
      reader.readAsDataURL(file);
    }
  }

  submitReview() {
    if (this.rating() === 0) {
      this.toastService.error('Please select a rating.');
      return;
    }

    this.isSubmitting.set(true);
    const request = {
      ratingValue: this.rating(),
      reviewText: this.reviewText(),
      isRecommended: this.isRecommended() === null ? undefined : this.isRecommended()!
    };

    const request$ = this.isEditMode() 
      ? this.reviewsService.updateReview(this.reviewId()!, request)
      : this.reviewsService.createReview(this.productId(), request);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toastService.success(this.isEditMode() ? 'Review updated successfully!' : 'Review submitted successfully!');
        this.router.navigate(['/account/reviews']);
      },
      error: (err: any) => {
        console.error('Failed to submit review', err);
        this.isSubmitting.set(false);
        this.toastService.error(err.error?.message || 'Failed to submit review. Please try again.');
      }
    });
  }
}




