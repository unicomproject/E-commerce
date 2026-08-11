import {
  Component,
  forwardRef,
  signal,
  input,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  COUNTRY_CODES,
  CountryCode,
  findByCode,
  findByPhone,
  stripDialCode,
} from '../../data/country-codes.data';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
  host: { style: 'display: block' },
  template: `
    <div class="flex items-stretch gap-2">

      <!-- Country Code Selector -->
      <div class="relative flex-shrink-0" (click)="$event.stopPropagation()">
        <button
          type="button"
          id="phone-country-btn"
          (click)="toggleDropdown()"
          class="h-full min-w-[96px] flex items-center gap-1.5 px-3 py-2.5 rounded-lg border transition-all text-sm font-medium"
          [class]="isOpen() ? 'border-brand-orange ring-2 ring-brand-orange bg-white' : 'border-gray-300 bg-white hover:border-gray-400'"
        >
          <span class="text-lg leading-none">{{ selectedCountry().flag }}</span>
          <span class="text-gray-700">{{ selectedCountry().dial }}</span>
          <svg
            class="w-3.5 h-3.5 text-gray-400 transition-transform ml-auto"
            [class.rotate-180]="isOpen()"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown -->
        <div
          *ngIf="isOpen()"
          class="absolute top-full mt-1 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          <!-- Search -->
          <div class="p-2 border-b border-gray-100">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearch($event)"
              placeholder="Search country or code..."
              class="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            />
          </div>

          <!-- List -->
          <div class="overflow-y-auto max-h-56">
            <button
              *ngFor="let country of filteredCountries()"
              type="button"
              (click)="selectCountry(country)"
              class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-brand-orange-light/30 transition-colors text-left"
              [class.bg-brand-orange-light]="country.code === selectedCountry().code"
            >
              <span class="text-xl leading-none w-7 text-center flex-shrink-0">{{ country.flag }}</span>
              <span class="text-sm text-gray-800 font-medium flex-1 truncate">{{ country.name }}</span>
              <span class="text-xs text-gray-400 font-mono flex-shrink-0">{{ country.dial }}</span>
            </button>
            <p *ngIf="filteredCountries().length === 0" class="text-center text-sm text-gray-400 py-4">
              No results found
            </p>
          </div>
        </div>
      </div>

      <!-- Phone Number Input -->
      <input
        type="tel"
        inputmode="numeric"
        pattern="[0-9+\-\s]*"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
        [id]="inputId()"
        [placeholder]="placeholder()"
        [(ngModel)]="subscriberNumber"
        (input)="onNumberChange()"
        (keydown)="onKeyDown($event)"
        (blur)="onTouched()"
        class="flex-1 rounded-lg border border-gray-300 py-2.5 px-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-shadow"
        [class.border-red-500]="hasError()"
      />
    </div>
  `,
})
export class PhoneInputComponent implements ControlValueAccessor, OnInit {
  // Inputs
  readonly defaultCountryCode = input<string>('LK');
  readonly placeholder = input<string>('Phone number');
  readonly inputId = input<string>('phone');
  readonly hasError = input<boolean>(false);

  // Internal state
  selectedCountry = signal<CountryCode>(COUNTRY_CODES.find(c => c.code === 'LK')!);
  subscriberNumber = '';
  isOpen = signal(false);
  searchQuery = '';
  filteredCountries = signal<CountryCode[]>(COUNTRY_CODES);

  // CVA callbacks
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const defaultCode = findByCode(this.defaultCountryCode());
    if (defaultCode) this.selectedCountry.set(defaultCode);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.searchQuery = '';
      this.filteredCountries.set(COUNTRY_CODES);
    }
  }

  onSearch(event: Event) {
    const q = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCountries.set(
      COUNTRY_CODES.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.dial.includes(q) ||
          c.code.toLowerCase().includes(q)
      )
    );
  }

  selectCountry(country: CountryCode) {
    this.selectedCountry.set(country);
    this.isOpen.set(false);
    this.emitValue();
  }

  onNumberChange() {
    // Strip any letters that may have slipped through (e.g. via paste or autocorrect)
    this.subscriberNumber = this.subscriberNumber.replace(/[^0-9+\-\s]/g, '');
    this.emitValue();
  }

  onKeyDown(event: KeyboardEvent) {
    // Allow: backspace, delete, tab, escape, enter, home, end, arrow keys
    const controlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
                         'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (controlKeys.includes(event.key)) return;

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey || event.metaKey) return;

    // Allow: digits 0-9, +, -, space
    if (/^[0-9+\-\s]$/.test(event.key)) return;

    // Block everything else (letters, symbols, etc.)
    event.preventDefault();
  }

  private emitValue() {
    const num = this.subscriberNumber.trim();
    if (!num) {
      this.onChange('');
      return;
    }
    // If user typed full number with +, use as-is
    if (num.startsWith('+')) {
      this.onChange(num);
      return;
    }
    // Combine: dialCode + number (strip leading 0 from local number)
    const full = this.selectedCountry().dial + num.replace(/^0/, '');
    this.onChange(full);
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    if (!value) {
      this.subscriberNumber = '';
      return;
    }

    // Try to detect country from stored value
    const detected = findByPhone(value);
    const defaultFallback = findByCode(this.defaultCountryCode());

    if (detected) {
      // If the tenant's default country has the same dial code as detected,
      // prefer defaultCountryCode to avoid wrong country (e.g. BS vs LK for +1)
      if (defaultFallback && defaultFallback.dial === detected.dial) {
        this.selectedCountry.set(defaultFallback);
      } else {
        this.selectedCountry.set(detected);
      }
      this.subscriberNumber = stripDialCode(value, this.selectedCountry().dial);
    } else {
      this.subscriberNumber = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {}
}
