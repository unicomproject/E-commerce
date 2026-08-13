import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { Category } from '../../../../core/models';
import { Observable, combineLatest, of, throwError } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideChevronDown, lucideSlidersHorizontal, lucideChevronRight } from '@ng-icons/lucide';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { PromoBanners } from '../../components/promo-banners/promo-banners';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, CategoryCardComponent, PromoBanners, BreadcrumbsComponent],
  templateUrl: './category-detail.html',
  viewProviders: [provideIcons({ lucideArrowLeft, lucideChevronDown, lucideSlidersHorizontal, lucideChevronRight })]
})
export class CategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storefrontData = inject(StorefrontDataService);
  private cdr = inject(ChangeDetectorRef);

  category: Category | null = null;
  subcategories: Category[] = [];
  
  totalItems: number = 0;
  isLoading = true;
  breadcrumbItems: BreadcrumbItem[] = [];

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) return throwError(() => new Error('No slug provided'));
        
        return this.storefrontData.getCategoryBySlug(slug).pipe(
          switchMap(category => {
            if (!category) return throwError(() => new Error('Category not found'));
            
            this.category = category;
            this.breadcrumbItems = [
              { label: 'Home', link: '/' },
              { label: 'Shop', link: '/categories' },
              { label: category.name }
            ];
            return this.storefrontData.getChildCategories(category.id).pipe(
              map(children => ({ category, children }))
            );
          })
        );
      }),
      catchError(err => {
        console.error(err);
        this.isLoading = false;
        // Navigate back or to a not-found page if category invalid
        this.router.navigate(['/']);
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.category = data.category;
        this.subcategories = data.children;
        
        // Calculate total items across subcategories if root category item count isn't accurate
        this.totalItems = this.subcategories.reduce((acc, curr) => acc + (curr.itemCount || 0), 0);
        if (this.totalItems === 0 && this.category.itemCount) {
           this.totalItems = this.category.itemCount;
        }

        this.isLoading = false;
        this.cdr.detectChanges();

        // If no subcategories exist, we can choose to navigate to the product list page
        if (this.subcategories.length === 0) {
          this.router.navigate(['/collections', this.category.slug]);
        }
      }
    });
  }
}
