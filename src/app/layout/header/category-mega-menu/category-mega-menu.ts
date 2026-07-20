import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StorefrontDataService } from '../../../features/storefront/services/storefront-data.service';
import { Category, StorefrontProductListReadModel } from '../../../core/models';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-category-mega-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, LoadingSpinnerComponent],
  viewProviders: [provideIcons({ lucideChevronRight })],
  template: `
    <div class="absolute top-full left-0 w-[850px] bg-white border border-gray-200 shadow-xl rounded-b-xl z-50 flex overflow-hidden min-h-[400px] max-h-[500px]">
      
      <!-- Left Sidebar: Root Categories -->
      <div class="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto py-2">
        <ul class="flex flex-col">
          <li *ngFor="let root of rootCategories()" 
              (mouseenter)="onHoverRootCategory(root)"
              [class.bg-white]="activeRoot()?.id === root.id"
              [class.border-l-4]="true"
              [class.border-brand-orange]="activeRoot()?.id === root.id"
              [class.border-transparent]="activeRoot()?.id !== root.id"
              class="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors">
            <span class="text-sm font-semibold text-gray-800">{{ root.name }}</span>
            <ng-icon name="lucideChevronRight" class="text-gray-400 text-[16px]"></ng-icon>
          </li>
          
          <!-- Loading State for Roots -->
          <li *ngIf="isLoadingRoots()" class="flex justify-center">
            <app-loading-spinner size="sm" containerClass="h-16"></app-loading-spinner>
          </li>
        </ul>
      </div>

      <!-- Right Content Area: Subcategories / Products -->
      <div class="w-2/3 bg-white flex flex-col h-full overflow-hidden relative">
        <!-- Header -->
        <div class="px-6 pt-6 pb-4 shrink-0 bg-white z-10">
          <h3 class="text-lg font-bold text-gray-900" *ngIf="activeRoot()">{{ activeRoot()?.name }}</h3>
        </div>
        
        <!-- Scrollable Content -->
        <div class="px-6 pb-6 overflow-y-auto flex-1">
        
        <!-- Loading State for Subcategories -->
        <app-loading-spinner *ngIf="isLoadingChildren()"></app-loading-spinner>

        <div *ngIf="!isLoadingChildren() && activeChildren().length > 0" class="grid grid-cols-3 gap-y-8 gap-x-4">
          <a *ngFor="let child of activeChildren()" [routerLink]="['/search']" [queryParams]="{ category: child.slug }" class="flex flex-col items-center group cursor-pointer text-center">
            <div class="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 mb-3 shadow-sm group-hover:shadow-md transition-shadow ring-1 ring-black/5 group-hover:ring-brand-orange/30 p-2 flex items-center justify-center">
              <img [src]="child.imageUrl || 'https://images.unsplash.com/photo-1555529733-0e670560f4e1?w=200&h=200&fit=crop'" [alt]="child.name" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300">
            </div>
            <span class="text-xs font-medium text-gray-700 group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight">{{ child.name }}</span>
          </a>
        </div>

        <app-loading-spinner *ngIf="!isLoadingChildren() && activeChildren().length === 0 && activeRoot() && isLoadingProducts()"></app-loading-spinner>

        <div *ngIf="!isLoadingChildren() && activeChildren().length === 0 && activeRoot() && !isLoadingProducts() && activeProducts().length > 0" class="flex flex-col h-full">
          <div class="grid grid-cols-3 gap-y-8 gap-x-4 mb-4">
            <a *ngFor="let product of activeProducts()" [routerLink]="['/product', product.slug]" class="flex flex-col items-center group cursor-pointer text-center">
              <div class="w-24 h-24 rounded-2xl overflow-hidden bg-white mb-3 shadow-sm group-hover:shadow-md transition-shadow ring-1 ring-black/5 group-hover:ring-brand-orange/30 p-2 flex items-center justify-center">
                <img [src]="product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'" [alt]="product.name" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300">
              </div>
              <span class="text-xs font-medium text-gray-700 group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight">{{ product.name }}</span>
            </a>
          </div>
        </div>

        <div *ngIf="!isLoadingChildren() && activeChildren().length === 0 && activeRoot() && !isLoadingProducts() && activeProducts().length === 0" class="flex flex-col items-center justify-center h-32 text-gray-400">
          <p class="text-sm">No items found.</p>
          <a [routerLink]="['/search']" [queryParams]="{ category: activeRoot()?.slug }" class="mt-2 text-sm text-brand-orange hover:underline">View all in {{ activeRoot()?.name }}</a>
        </div>
        </div>

        <!-- Sticky Footer for View All Products -->
        <div *ngIf="!isLoadingChildren() && activeChildren().length === 0 && activeRoot() && !isLoadingProducts() && activeProducts().length > 0" class="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] shrink-0 z-10 flex justify-center">
          <a [routerLink]="['/search']" [queryParams]="{ category: activeRoot()?.slug }" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark hover:underline transition-colors">
            View all products in {{ activeRoot()?.name }}
            <ng-icon name="lucideChevronRight" class="text-[16px]"></ng-icon>
          </a>
        </div>
      </div>

    </div>
  `
})
export class CategoryMegaMenu implements OnInit, OnDestroy {
  private dataService = inject(StorefrontDataService);

  rootCategories = signal<Category[]>([]);
  activeRoot = signal<Category | null>(null);
  activeChildren = signal<Category[]>([]);
  activeProducts = signal<StorefrontProductListReadModel[]>([]);
  
  isLoadingRoots = signal(true);
  isLoadingChildren = signal(false);
  isLoadingProducts = signal(false);

  // Cache to avoid refetching on every hover
  private childrenCache = new Map<string, Category[]>();
  private productsCache = new Map<string, StorefrontProductListReadModel[]>();

  private hoverSubject = new Subject<Category>();
  private hoverSubscription?: Subscription;

  ngOnInit() {
    this.hoverSubscription = this.hoverSubject.pipe(
      debounceTime(200)
    ).subscribe(root => {
      this.processHoverRootCategory(root);
    });
    this.dataService.getRootCategories().subscribe({
      next: (categories) => {
        this.rootCategories.set(categories);
        this.isLoadingRoots.set(false);
        if (categories.length > 0) {
          this.onHoverRootCategory(categories[0]);
        }
      },
      error: () => this.isLoadingRoots.set(false)
    });
  }

  ngOnDestroy() {
    this.hoverSubscription?.unsubscribe();
  }

  onHoverRootCategory(root: Category) {
    if (this.activeRoot()?.id === root.id) return;
    this.activeRoot.set(root); // Visual update immediately
    this.hoverSubject.next(root);
  }

  private processHoverRootCategory(root: Category) {
    if (this.childrenCache.has(root.id)) {
      const children = this.childrenCache.get(root.id)!;
      this.activeChildren.set(children);
      
      if (children.length === 0) {
        this.loadProductsForRoot(root.id);
      } else {
        this.activeProducts.set([]);
      }
    } else {
      this.isLoadingChildren.set(true);
      this.activeChildren.set([]); // Clear previous while loading
      this.activeProducts.set([]);
      
      this.dataService.getChildCategories(root.id).subscribe({
        next: (children) => {
          this.childrenCache.set(root.id, children);
          if (this.activeRoot()?.id === root.id) {
            this.activeChildren.set(children);
            if (children.length === 0) {
              this.loadProductsForRoot(root.id);
            }
          }
          this.isLoadingChildren.set(false);
        },
        error: () => this.isLoadingChildren.set(false)
      });
    }
  }

  private loadProductsForRoot(categoryId: string) {
    if (this.productsCache.has(categoryId)) {
      this.activeProducts.set(this.productsCache.get(categoryId)!);
      return;
    }

    this.isLoadingProducts.set(true);
    this.dataService.getProducts(categoryId).subscribe({
      next: (response) => {
        const products = response.items.slice(0, 6); // Take up to 6 products
        this.productsCache.set(categoryId, products);
        if (this.activeRoot()?.id === categoryId) {
          this.activeProducts.set(products);
        }
        this.isLoadingProducts.set(false);
      },
      error: () => this.isLoadingProducts.set(false)
    });
  }
}