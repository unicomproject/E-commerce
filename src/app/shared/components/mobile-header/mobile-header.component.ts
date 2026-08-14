import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { Router, RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-header',
  standalone: true,
  imports: [NgIconComponent, RouterModule],
  viewProviders: [provideIcons({ lucideArrowLeft })],
  templateUrl: './mobile-header.component.html',
})
export class MobileHeaderComponent {
  title = input<string>();
  backLink = input<string>();
  customClasses = input<string>('');

  hasContent = false;

  constructor(private router: Router) {}

  ngAfterContentInit() {
    this.hasContent = true;
  }

  handleBack() {
    if (this.backLink()) {
      this.router.navigateByUrl(this.backLink()!);
    } else {
      window.history.back();
    }
  }
}
