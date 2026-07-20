import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { StorefrontProductListReadModel, Category } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { FilterSortButtonComponent } from '../../../../shared/components/filter-sort-button/filter-sort-button.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, CategoryCardComponent, BreadcrumbsComponent, FilterSortButtonComponent],
  templateUrl: './collections.html',
  styleUrl: './collections.css'
})
export class Collections implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(StorefrontDataService);
  private cdr = inject(ChangeDetectorRef);

  slug = '';
  category: Category | null = null;
  childCategories: Category[] = [];
  products: StorefrontProductListReadModel[] = [];
  loading = true;
  breadcrumbItems: BreadcrumbItem[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      if (this.slug) {
        this.loadCategory();
      } else {
        this.loading = false;
      }
    });
  }

  loadCategory() {
    this.loading = true;
    this.cdr.detectChanges();
    this.dataService.getCategoryBySlug(this.slug).subscribe({
      next: (cat) => {
        if (!cat || !cat.id) {
            this.loading = false;
            this.cdr.detectChanges();
            return;
        }
        this.category = cat;
        this.breadcrumbItems = [
          { label: 'Home', link: '/' },
          { label: 'Shop', link: '/categories' },
          { label: cat.name }
        ];
        this.loadChildren(cat.id);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadChildren(categoryId: string) {
    this.cdr.detectChanges();
    this.dataService.getChildCategories(categoryId).subscribe({
      next: (children) => {
        this.childCategories = children || [];
        if (this.childCategories.length === 0) {
          // If no child categories, redirect to search page
          this.router.navigate(['/search'], { queryParams: { category: this.slug }, replaceUrl: true });
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts(categoryId: string) {
    this.dataService.getProducts(categoryId).subscribe({
      next: (res) => {
        this.products = res.items || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
