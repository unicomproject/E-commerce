import { Component, OnInit, inject, signal, DestroyRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft, lucideLayoutGrid, lucideList, lucideLoader2 } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StorefrontSearchMatchReadModel, StorefrontProductListReadModel } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { FilterSortButtonComponent } from '../../../../shared/components/filter-sort-button/filter-sort-button.component';
import { SearchBarComponent } from '../../../../layout/header/search-bar/search-bar';
import { DEMO_SNEAKER } from '../../../../core/mocks/demo-product.mock';
import { CategoryBottomSheetComponent } from '../../components/category-bottom-sheet/category-bottom-sheet';
import { MobileHeaderComponent } from '../../../../shared/components/mobile-header/mobile-header.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIconComponent, SearchBarComponent, ProductCardComponent, FilterSortButtonComponent, BreadcrumbsComponent, MobileHeaderComponent],
  templateUrl: './search.html',
  styleUrl: './search.css',
  viewProviders: [provideIcons({ lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft, lucideLayoutGrid, lucideList, lucideLoader2 })]
})
export class Search implements OnInit, AfterViewInit, OnDestroy {
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
  layout = signal<'grid' | 'list'>('grid');

  page = signal(1);
  pageSize = signal(12);
  hasMore = signal(true);
  loadingMore = signal(false);

  @ViewChild('scrollSentinel') scrollSentinel!: ElementRef;
  private observer: IntersectionObserver | null = null;

  setLayout(mode: 'grid' | 'list') {
    this.layout.set(mode);
  }

  toggleLayout() {
    this.layout.update(l => l === 'grid' ? 'list' : 'grid');
  }

  goBack() {
    history.back();
  }

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
      this.page.set(1);
      
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

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loading() && !this.loadingMore() && this.hasMore()) {
          this.loadMore();
        }
      });
    }, options);

    if (this.scrollSentinel) {
      this.observer.observe(this.scrollSentinel.nativeElement);
    }
  }

  loadMore() {
    if (!this.hasMore() || this.loadingMore()) return;
    this.page.update(p => p + 1);
    this.performSearch();
  }

  performSearch() {
    if (this.page() === 1) {
      this.loading.set(true);
    } else {
      this.loadingMore.set(true);
    }
    
    const request: any = {
      page: this.page(),
      pageSize: this.pageSize()
    };
    if (this.query()) request.searchText = this.query();
    if (this.categoryId()) request.categoryId = this.categoryId();

    this.dataService.searchProducts(request).subscribe({
      next: (res) => {
        setTimeout(() => {
          const mockListItem: any = {
            ...DEMO_SNEAKER,
            imageUrl: DEMO_SNEAKER.images[0]?.url || ''
          };
          
          const newProducts = res.products?.items || [];
          if (this.page() === 1) {
             this.products.set([mockListItem, ...newProducts]);
          } else {
             this.products.update(p => [...p, ...newProducts]);
          }
          
          this.categories.set(res.categories || []);
          this.collections.set(res.collections || []);
          this.totalCount.set(res.totalCount || 0);
          this.hasMore.set(res.products?.hasNextPage ?? false);
          
          this.loading.set(false);
          this.loadingMore.set(false);
        }, 600);
      },
      error: (err) => {
        console.error('Search error', err);
        this.loading.set(false);
        this.loadingMore.set(false);
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
