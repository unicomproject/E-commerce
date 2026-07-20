import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorefrontDataService } from '../../services/storefront-data.service';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { FulfillmentSelector } from '../../components/fulfillment-selector/fulfillment-selector';
import { Category } from '../../../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryCardComponent, FulfillmentSelector],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories implements OnInit {
  private storefrontData = inject(StorefrontDataService);
  
  categories$!: Observable<Category[]>;

  ngOnInit(): void {
    this.categories$ = this.storefrontData.getRootCategories();
  }
}
