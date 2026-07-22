import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideChevronDown, lucideChevronRight, lucideArrowLeft, lucideImage } from '@ng-icons/lucide';
import { CategoryModalService } from '../../../../core/services/category-modal.service';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { Category } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-category-bottom-sheet',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, LoadingSpinnerComponent],
  viewProviders: [provideIcons({ lucideX, lucideChevronDown, lucideChevronRight, lucideArrowLeft, lucideImage })],
  templateUrl: './category-bottom-sheet.html',
})
export class CategoryBottomSheetComponent implements OnInit {
  modalService = inject(CategoryModalService);
  private dataService = inject(StorefrontDataService);
  private router = inject(Router);

  rootCategories = signal<Category[]>([]);
  
  // Drill-down state
  currentParentCategory = signal<Category | null>(null);
  childCategoriesMap = signal<{ [key: string]: Category[] }>({});
  
  isLoading = signal(true);
  isNavigatingSub = signal(false);

  // Compute what categories to show right now
  displayCategories = computed(() => {
    const parent = this.currentParentCategory();
    if (!parent) return this.rootCategories();
    return this.childCategoriesMap()[parent.id] || [];
  });

  ngOnInit() {
    this.dataService.getRootCategories().subscribe({
      next: (categories) => {
        this.rootCategories.set(categories);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onCategoryClick(category: Category) {
    // If it's a root category and has children, drill down
    if (!this.currentParentCategory()) {
      this.isNavigatingSub.set(true);
      
      // Load children if not already loaded
      if (!this.childCategoriesMap()[category.id]) {
        this.dataService.getChildCategories(category.id).subscribe(children => {
          if (children && children.length > 0) {
            this.childCategoriesMap.update(curr => ({ ...curr, [category.id]: children }));
            this.currentParentCategory.set(category);
          } else {
            // No subcategories, just navigate to it!
            this.navigateToCategory(category.slug);
          }
          this.isNavigatingSub.set(false);
        });
      } else {
        const children = this.childCategoriesMap()[category.id];
        if (children && children.length > 0) {
          this.currentParentCategory.set(category);
        } else {
          this.navigateToCategory(category.slug);
        }
        this.isNavigatingSub.set(false);
      }
    } else {
      // If we are already in subcategories, navigate to search
      this.navigateToCategory(category.slug);
    }
  }

  goBack() {
    this.currentParentCategory.set(null);
  }

  navigateToCategory(slug: string) {
    this.modalService.close();
    this.router.navigate(['/search'], { queryParams: { category: slug } });
  }

  close() {
    this.modalService.close();
    // Reset view for next open
    setTimeout(() => {
      this.currentParentCategory.set(null);
    }, 300);
  }
}

