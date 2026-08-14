import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  readonly items = input<BreadcrumbItem[]>([]);
}
