import { MobileHeaderComponent } from '../../../../shared/components/mobile-header/mobile-header.component';
import { Component, OnInit, inject , ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorefrontDataService } from '../../services/catalog.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Category } from '../../../../core/models';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTag, lucideArrowLeft } from '@ng-icons/lucide';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryCardComponent, NgIconComponent, BreadcrumbsComponent, MobileHeaderComponent],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
  viewProviders: [provideIcons({ lucideTag, lucideArrowLeft })]
})
export class Categories implements OnInit {
  private storefrontData = inject(StorefrontDataService);
  authService = inject(AuthService);
  
  categories$!: Observable<Category[]>;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Categories' }
  ];

  ngOnInit(): void {
    this.categories$ = this.storefrontData.getRootCategories().pipe(
      switchMap(rootCategories => {
        if (!rootCategories || rootCategories.length === 0) return of([]);
        
        const requests = rootCategories.map(rootCat => 
          this.storefrontData.getChildCategories(rootCat.id).pipe(
            map(children => {
              const enrichedCat = { ...rootCat };
              
              if (children && children.length > 0) {
                // Format description based on first two child categories
                const names = children.slice(0, 2).map(c => c.name);
                enrichedCat.description = names.join(', ') + (children.length > 2 ? ' & more' : '.');
                
                // Aggregate total item count
                const childrenItemCount = children.reduce((sum, child) => sum + (child.itemCount || 0), 0);
                enrichedCat.itemCount = (rootCat.itemCount || 0) + childrenItemCount;
              }
              
              return enrichedCat;
            })
          )
        );
        
        return forkJoin(requests);
      })
    );
  }
}
