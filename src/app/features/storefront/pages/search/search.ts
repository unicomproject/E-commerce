import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StorefrontSearchMatchReadModel, StorefrontProductListReadModel } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../../../layout/header/search-bar/search-bar';
import { DEMO_SNEAKER } from '../../../../core/mocks/demo-product.mock';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, ProductCardComponent, PageHeaderComponent, SearchBarComponent],
  templateUrl: './search.html',
  styleUrl: './search.css',
  viewProviders: [provideIcons({ lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft })]
})
export class Search implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(StorefrontDataService);
  private router = inject(Router);

  private destroyRef = inject(DestroyRef);
  
  query = signal('');
  searchInput = signal('');
  private searchSubject = new Subject<string>();
  
  categorySlug = signal('');
  categoryId = signal('');
  loading = signal(true);
  
  products = signal<StorefrontProductListReadModel[]>([]);
  categories = signal<StorefrontSearchMatchReadModel[]>([]);
  collections = signal<StorefrontSearchMatchReadModel[]>([]);
  totalCount = signal(0);
  
  breadcrumbItems = signal<BreadcrumbItem[]>([]);

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(query => {
      this.router.navigate(['/search'], { queryParams: { q: query, category: this.categorySlug(), categoryId: this.categoryId() } });
    });

    this.route.queryParams.subscribe(params => {
      this.query.set(params['q'] || '');
      this.searchInput.set(this.query());
      this.categorySlug.set(params['category'] || '');
      this.categoryId.set(params['categoryId'] || '');
      
      if (this.categorySlug() && !this.categoryId()) {
        this.loading.set(true);
        this.dataService.getCategoryBySlug(this.categorySlug()).subscribe({
          next: (cat) => {
            if (cat && cat.id) {
               this.categoryId.set(cat.id);
               this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: 'Products', link: '/categories' }]);
            } else {
               this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: this.query() ? 'Search Results' : 'Products' }]);
            }
            this.performSearch();
          },
          error: () => {
            this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: this.query() ? 'Search Results' : 'Products' }]);
            this.performSearch();
          }
        });
      } else {
        this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: this.query() ? 'Search Results' : 'Products' }]);
        this.performSearch();
      }
    });
  }

  performSearch() {
    this.loading.set(true);
    const request: any = {};
    if (this.query()) request.searchText = this.query();
    if (this.categoryId()) request.categoryId = this.categoryId();

    this.dataService.searchProducts(request).subscribe({
      next: (res) => {
        setTimeout(() => {
          const mockListItem: any = {
            ...DEMO_SNEAKER,
            imageUrl: DEMO_SNEAKER.images[0]?.url || ''
          };
          this.products.set([mockListItem, ...(res.products?.items || [])]);
          this.categories.set(res.categories || []);
          this.collections.set(res.collections || []);
          this.totalCount.set(res.totalCount || 0);
          this.loading.set(false);
        }, 600);
      },
      error: (err) => {
        console.error('Search error', err);
        this.loading.set(false);
      }
    });
  }

  onSearchSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchInput() || null }, queryParamsHandling: 'merge' });
  }

  onSearchInput(query: string) {
    this.searchInput.set(query);
    this.searchSubject.next(query);
  }

  onClearSearch() {
    this.searchInput.set('');
    this.searchSubject.next('');
  }
}
