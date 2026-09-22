import { Component, OnInit, inject, signal, DestroyRef, ViewChild, ElementRef, AfterViewInit, OnDestroy , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch, lucideX, lucideArrowLeft, lucideLayoutGrid, lucideList, lucideLoader2 } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/catalog.service';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StorefrontSearchMatchReadModel, StorefrontProductListReadModel } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { FilterSortButtonComponent } from '../../../../shared/components/filter-sort-button/filter-sort-button.component';
import { SearchBarComponent } from '../../../../layout/header/search-bar/search-bar.component';
import { DEMO_SNEAKER } from '../../../../core/mocks/demo-product.mock';
import { CategoryBottomSheetComponent } from '../../components/category-bottom-sheet/category-bottom-sheet.component';
import { SortBottomSheetComponent, SortOption } from '../../components/sort-bottom-sheet/sort-bottom-sheet.component';
import { MobileHeaderComponent } from '../../../../shared/components/mobile-header/mobile-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIconComponent, SearchBarComponent, ProductCardComponent, FilterSortButtonComponent, BreadcrumbsComponent, MobileHeaderComponent, SortBottomSheetComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
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
  private triggerSearchSubject = new Subject<void>();
  
  categorySlug = signal('');
  categoryId = signal('');
  loading = signal(true);
  
  products = signal<StorefrontProductListReadModel[]>([]);
  categories = signal<StorefrontSearchMatchReadModel[]>([]);
  collections = signal<StorefrontSearchMatchReadModel[]>([]);
  totalCount = signal(0);
  
  breadcrumbItems = signal<BreadcrumbItem[]>([]);
  layout = signal<'grid' | 'list'>('grid');
  
  isSortSheetOpen = signal(false);
  activeSort = signal<SortOption | null>(null);

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
      debounceTime(250),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(query => {
      // replaceUrl avoids pushing a new history entry per keystroke, which
      // would otherwise make the back button step through every letter typed.
      this.router.navigate(['/search'], {
        queryParams: { q: query, category: this.categorySlug(), categoryId: this.categoryId() },
        replaceUrl: true,
      });
    });



    this.triggerSearchSubject.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => {
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
        if (this.activeSort()) request.sort = this.activeSort() ?? undefined;

        return this.dataService.searchProducts(request).pipe(
          catchError((err) => {
            console.error('Search error', err);
            return of(null);
          })
        );
      })
    ).subscribe((res: any) => {
      if (res) {
        const mockListItem: any = {
          ...DEMO_SNEAKER,
          imageUrl: DEMO_SNEAKER.images[0]?.url || ''
        };
        
        const newProducts = res.products?.items || [];
        let combinedProducts = [];
        if (this.page() === 1) {
           combinedProducts = [mockListItem, ...newProducts];
        } else {
           combinedProducts = [...this.products(), ...newProducts];
        }

        if (this.activeSort() === 'price_asc') {
           combinedProducts.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
        } else if (this.activeSort() === 'price_desc') {
           combinedProducts.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
        }

        this.products.set(combinedProducts);
        
        this.categories.set(res.categories || []);
        this.collections.set(res.collections || []);
        this.totalCount.set(res.totalCount || 0);
        this.hasMore.set(res.products?.hasNextPage ?? false);
      }
      this.loading.set(false);
      this.loadingMore.set(false);
    });

    // We must subscribe to route queryParams AFTER setting up triggerSearchSubject,
    // because route.queryParams fires synchronously on initial load in Angular,
    // which would cause the initial event to be lost if triggerSearchSubject isn't listening yet.
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(params => {
        this.query.set(params['q'] || '');
        this.searchInput.set(this.query());
        this.categorySlug.set(params['category'] || '');
        this.categoryId.set(params['categoryId'] || '');
        this.page.set(1);
        
        if (this.categorySlug() && !this.categoryId()) {
          this.loading.set(true);
          return this.dataService.getCategoryBySlug(this.categorySlug()).pipe(
            map(cat => {
              if (cat && cat.id) {
                 this.categoryId.set(cat.id);
                 this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: 'Products', link: '/categories' }]);
              } else {
                 this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: this.query() ? 'Search Results' : 'Products' }]);
              }
              return 'PERFORM_SEARCH';
            }),
            catchError(() => {
              this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: this.query() ? 'Search Results' : 'Products' }]);
              return of('PERFORM_SEARCH');
            })
          );
        } else {
          this.breadcrumbItems.set([{ label: 'Home', link: '/' }, { label: this.query() ? 'Search Results' : 'Products' }]);
          return of('PERFORM_SEARCH');
        }
      })
    ).subscribe(action => {
       if (action === 'PERFORM_SEARCH') {
          this.triggerSearchSubject.next();
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

  openSortSheet() {
    this.isSortSheetOpen.set(true);
  }
  
  onSortSelected(sort: SortOption) {
    this.activeSort.set(sort);
    this.page.set(1);
    this.performSearch();
  }

  performSearch() {
    this.triggerSearchSubject.next();
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

