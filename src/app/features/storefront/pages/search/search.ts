import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StorefrontSearchMatchReadModel, StorefrontProductListReadModel } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { FilterSortButtonComponent } from '../../../../shared/components/filter-sort-button/filter-sort-button.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DEMO_SNEAKER } from '../../../../core/mocks/demo-product.mock';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, ProductCardComponent, PageHeaderComponent],
  templateUrl: './search.html',
  styleUrl: './search.css',
  viewProviders: [provideIcons({ lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft })]
})
export class Search implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(StorefrontDataService);
  private cdr = inject(ChangeDetectorRef);

  private router = inject(Router);

  query = '';
  searchInput = '';
  categorySlug = '';
  categoryId = '';
  loading = true;
  
  products: StorefrontProductListReadModel[] = [];
  categories: StorefrontSearchMatchReadModel[] = [];
  collections: StorefrontSearchMatchReadModel[] = [];
  totalCount = 0;
  
  breadcrumbItems: BreadcrumbItem[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.searchInput = this.query;
      this.categorySlug = params['category'] || '';
      this.categoryId = params['categoryId'] || '';
      
      if (this.categorySlug && !this.categoryId) {
        this.loading = true;
        this.dataService.getCategoryBySlug(this.categorySlug).subscribe({
          next: (cat) => {
            if (cat && cat.id) {
               this.categoryId = cat.id;
               this.breadcrumbItems = [{ label: 'Home', link: '/' }, { label: 'Shop', link: '/categories' }];
            } else {
               this.breadcrumbItems = [{ label: 'Home', link: '/' }, { label: this.query ? 'Search Results' : 'Shop' }];
            }
            this.performSearch();
          },
          error: () => {
            this.breadcrumbItems = [{ label: 'Home', link: '/' }, { label: this.query ? 'Search Results' : 'Products' }];
            this.performSearch();
          }
        });
      } else {
        this.breadcrumbItems = [{ label: 'Home', link: '/' }, { label: this.query ? 'Search Results' : 'Products' }];
        this.performSearch();
      }
    });
  }

  performSearch() {
    this.loading = true;
    const request: any = {};
    if (this.query) request.searchText = this.query;
    if (this.categoryId) request.categoryId = this.categoryId;

    this.dataService.searchProducts(request).subscribe({
      next: (res) => {
        setTimeout(() => {
          const mockListItem: any = {
            ...DEMO_SNEAKER,
            imageUrl: DEMO_SNEAKER.images[0]?.url || ''
          };
          this.products = [mockListItem, ...(res.products?.items || [])];
          this.categories = res.categories || [];
          this.collections = res.collections || [];
          this.totalCount = res.totalCount || 0;
          this.loading = false;
          this.cdr.detectChanges();
        }, 600);
      },
      error: (err) => {
        console.error('Search error', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchInput || null }, queryParamsHandling: 'merge' });
  }

  onClearSearch() {
    this.searchInput = '';
    this.onSearchSubmit();
  }
}
