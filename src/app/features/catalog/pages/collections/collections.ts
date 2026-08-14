import { Component, OnInit, inject, signal, ChangeDetectionStrategy , DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorefrontDataService } from '../../services/catalog.service';
import { StorefrontProductListReadModel, Category } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { FilterSortButtonComponent } from '../../../../shared/components/filter-sort-button/filter-sort-button.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-collections',
  standalone: true,
  imports: [
    RouterModule,
    ProductCardComponent,
    CategoryCardComponent,
    FilterSortButtonComponent,
    PageHeaderComponent,
  ],
  templateUrl: './collections.html',
  styleUrl: './collections.css',
})
export class Collections implements OnInit {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(StorefrontDataService);

  slug = signal('');
  category = signal<Category | null>(null);
  childCategories = signal<Category[]>([]);
  products = signal<StorefrontProductListReadModel[]>([]);
  loading = signal(true);
  breadcrumbItems = signal<BreadcrumbItem[]>([]);

  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.slug.set(params.get('slug') || '');
      this.category.set(null);
      this.childCategories.set([]);
      this.products.set([]);

      if (this.slug()) {
        this.loadCategory();
      } else {
        this.loading.set(false);
      }
    });
  }

  loadCategory() {
    this.loading.set(true);
    this.dataService.getCategoryBySlug(this.slug()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (cat) => {
        if (!cat || !cat.id) {
          this.loading.set(false);
          return;
        }
        this.category.set(cat);
        this.breadcrumbItems.set([
          { label: 'Home', link: '/' },
          { label: 'Categories', link: '/categories' },
          { label: cat.name },
        ]);
        this.loadChildren(cat.id);
      },
      error: (err) => {
        console.error('Error loading category', err);
        this.loading.set(false);
      },
    });
  }

  loadChildren(categoryId: string) {
    this.dataService.getChildCategories(categoryId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (children) => {
        this.childCategories.set(children || []);
        if (this.childCategories().length === 0) {
          // If no child categories, redirect to search page
          this.router.navigate(['/search'], {
            queryParams: { category: this.slug() },
            replaceUrl: true,
          });
        } else {
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Error loading child categories', err);
        this.loading.set(false);
      },
    });
  }

  loadProducts(categoryId: string) {
    this.dataService.getProducts(categoryId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.products.set(res.items || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.loading.set(false);
      },
    });
  }
}
