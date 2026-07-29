import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StorefrontSearchMatchReadModel, StorefrontProductListReadModel } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
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
  private router = inject(Router);

  query = signal('');
  searchInput = signal('');
  categorySlug = signal('');
  categoryId = signal('');
  loading = signal(true);
  
  products = signal<StorefrontProductListReadModel[]>([]);
  categories = signal<StorefrontSearchMatchReadModel[]>([]);
  collections = signal<StorefrontSearchMatchReadModel[]>([]);
  totalCount = signal(0);
  
  breadcrumbItems = signal<BreadcrumbItem[]>([]);

  ngOnInit() {
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
               this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: 'Shop', link: '/categories' }]);
            } else {
               this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: this.query() ? 'Search Results' : 'Shop' }]);
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

  onClearSearch() {
    this.searchInput.set('');
    this.onSearchSubmit();
  }
}
