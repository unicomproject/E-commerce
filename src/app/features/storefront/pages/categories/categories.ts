import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Category } from '../../../../core/models';
import { Observable } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryCardComponent, PageHeaderComponent],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
  viewProviders: [provideIcons({ lucideArrowLeft })]
})
export class Categories implements OnInit {
  private storefrontData = inject(StorefrontDataService);
  
  categories$!: Observable<Category[]>;

  ngOnInit(): void {
    this.categories$ = this.storefrontData.getRootCategories();
  }
}
