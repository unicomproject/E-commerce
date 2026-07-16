import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { StorefrontSearchMatchReadModel, StorefrontProductListReadModel } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { TabsComponent, TabItem } from '../../../../shared/components/tabs/tabs.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, ProductCardComponent, TabsComponent],
  templateUrl: './search.html',
  styleUrl: './search.css',
  viewProviders: [provideIcons({ lucideHeart, lucideMapPin, lucideShoppingCart, lucideSlidersHorizontal, lucideCheckCircle2, lucideSearch })]
})
export class Search implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(StorefrontDataService);
  private cdr = inject(ChangeDetectorRef);

  query = '';
  loading = true;
  
  products: StorefrontProductListReadModel[] = [];
  categories: StorefrontSearchMatchReadModel[] = [];
  collections: StorefrontSearchMatchReadModel[] = [];
  totalCount = 0;
  
  activeTab = 'all';
  searchTabs: TabItem[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) {
        this.performSearch();
      } else {
        this.loading = false;
      }
    });
  }

  performSearch() {
    this.loading = true;
    this.dataService.searchProducts({ searchText: this.query }).subscribe({
      next: (res) => {
        this.products = res.products?.items || [];
        this.categories = res.categories || [];
        this.collections = res.collections || [];
        this.totalCount = res.totalCount || 0;
        this.searchTabs = [
          { id: 'all', label: 'All', count: this.totalCount },
          { id: 'products', label: 'Products', count: this.products.length },
          { id: 'collections', label: 'Collections', count: this.collections.length },
          { id: 'categories', label: 'Categories', count: this.categories.length }
        ];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Search error', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
