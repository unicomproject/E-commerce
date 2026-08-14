import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { StorefrontDataService } from '../../../features/catalog/services/catalog.service';
import {
  StorefrontProductListReadModel,
  StorefrontSearchMatchReadModel,
  StorefrontSearchReadModel,
} from '../../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideSearch, lucideX })],
  templateUrl: './search-bar.html',
  host: { class: 'w-full block relative' },
})
export class SearchBarComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  public dataService = inject(StorefrontDataService);

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  suggestedProducts: StorefrontProductListReadModel[] = [];
  suggestedCategories: StorefrontSearchMatchReadModel[] = [];
  isDropdownOpen = false;
  isSearchLoading = false;

  searchQuery = '';
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params['q'] && params['q'] !== this.searchQuery) {
        this.searchQuery = params['q'];
      } else if (!params['q'] && !params['category']) {
        this.searchQuery = '';
      }
    });

    this.searchSubject
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((query: string) => {
          const q = query.trim();
          if (q.length >= 1) {
            this.isSearchLoading = true;
            this.isDropdownOpen = true;
            return this.dataService.autocompleteSearch(q, 10).pipe(
              map((res: StorefrontSearchReadModel) => ({ query: q, res })),
              catchError(() => {
                this.isSearchLoading = false;
                return of(null);
              }),
            );
          } else {
            this.isDropdownOpen = false;
            this.suggestedProducts = [];
            this.suggestedCategories = [];
            return of(null);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result) {
          const queryLower = result.query.toLowerCase();

          let cats = result.res.categories || [];
          cats.sort((a: StorefrontSearchMatchReadModel, b: StorefrontSearchMatchReadModel) => {
            const aStarts = a.name.toLowerCase().startsWith(queryLower);
            const bStarts = b.name.toLowerCase().startsWith(queryLower);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return 0;
          });
          this.suggestedCategories = cats;

          let prods = result.res.products?.items || [];
          prods.sort((a: StorefrontProductListReadModel, b: StorefrontProductListReadModel) => {
            const aStarts = a.name.toLowerCase().startsWith(queryLower);
            const bStarts = b.name.toLowerCase().startsWith(queryLower);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return 0;
          });
          this.suggestedProducts = prods;

          this.isSearchLoading = false;
        }
      });
  }

  onSearchInput(query: string) {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.isDropdownOpen = false;
    this.suggestedProducts = [];
    this.suggestedCategories = [];
  }

  onSearchFocus() {
    if (this.searchQuery.trim().length >= 1) {
      this.isDropdownOpen = true;
    }
  }

  highlightMatch(text: string): string {
    if (!this.searchQuery) return `<b>${text}</b>`;
    const query = this.searchQuery.trim();
    if (!query) return `<b>${text}</b>`;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    let result = '';

    for (let i = 0; i < parts.length; i++) {
      if (parts[i].toLowerCase() === query.toLowerCase()) {
        result += parts[i];
      } else if (parts[i].length > 0) {
        result += `<b>${parts[i]}</b>`;
      }
    }

    return result;
  }

  onSearchSubmit() {
    this.isDropdownOpen = false;
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onSuggestionClick(type: 'product' | 'category', value: string) {
    this.isDropdownOpen = false;
    this.searchQuery = '';
    this.searchSubject.next('');
    if (type === 'product') {
      this.router.navigate(['/search'], { queryParams: { q: value } });
    } else if (type === 'category') {
      this.router.navigate(['/search'], { queryParams: { category: value } });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
