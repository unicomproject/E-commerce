import { Component, effect, input, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lazy-media-image',
  standalone: true,
  host: {
    class: 'relative block h-full w-full'
  },
  template: `
    <div class="relative h-full w-full overflow-hidden">
      @if (src() && !failed()) {
        <img
          [src]="src()!"
          [alt]="alt()"
          [attr.loading]="priority() ? 'eager' : 'lazy'"
          [attr.fetchpriority]="priority() ? 'high' : 'low'"
          decoding="async"
          class="absolute inset-0 h-full w-full transition-opacity duration-300"
          [class.object-cover]="fit() === 'cover'"
          [class.object-contain]="fit() === 'contain'"
          [class.opacity-0]="!loaded()"
          [class.opacity-100]="loaded()"
          (load)="loaded.set(true)"
          (error)="failed.set(true)"
        />
      }

      @if (!loaded() && !failed()) {
        <div class="absolute inset-0 media-skeleton" aria-hidden="true"></div>
      }
    </div>
  `,
})
export class LazyMediaImageComponent {
  readonly src = input<string | null | undefined>(null);
  readonly alt = input('');
  readonly priority = input(false);
  readonly fit = input<'cover' | 'contain'>('cover');

  readonly loaded = signal(false);
  readonly failed = signal(false);

  constructor() {
    effect(() => {
      const url = this.src();
      this.failed.set(false);
      if (!url) {
        this.loaded.set(false);
        return;
      }

      const cached = new Image();
      cached.src = url;
      this.loaded.set(cached.complete && cached.naturalWidth > 0);
    });
  }
}
