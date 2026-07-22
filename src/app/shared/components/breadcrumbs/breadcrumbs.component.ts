import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="flex items-center text-sm text-gray-500 flex-wrap gap-y-1">
      <ng-container *ngFor="let item of items; let last = last; let i = index">
        <a *ngIf="item.link" [routerLink]="item.link" class="hover:text-gray-900 transition-colors">{{ item.label }}</a>
        <span *ngIf="!item.link" class="text-gray-900 font-medium">{{ item.label }}</span>
        
        <span *ngIf="!last" class="mx-2 text-gray-400 text-xs flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </span>
      </ng-container>
    </nav>
  `
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
