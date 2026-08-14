import {
  Component,
  HostListener,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { BreadcrumbsComponent, BreadcrumbItem } from '../breadcrumbs/breadcrumbs.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, NgIconComponent, BreadcrumbsComponent],
  viewProviders: [provideIcons({ lucideArrowLeft })],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  readonly title = input('');
  readonly subtitle = input('');
  readonly noPadding = input(false);
  readonly showBack = input(true);
  readonly hideDesktopTitle = input(false);
  readonly customClasses = input('');
  readonly breadcrumbs = input<BreadcrumbItem[]>();
  readonly back = output<void>();

  readonly isNavbarHidden = signal(false);
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    this.isNavbarHidden.set(currentScroll > this.lastScrollTop && currentScroll > 60);
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  onBack() {
    this.back.emit();
    history.back();
  }
}
