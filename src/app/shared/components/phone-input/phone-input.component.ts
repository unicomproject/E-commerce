import {
  Component,
  forwardRef,
  signal,
  input,
  OnInit,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  COUNTRY_CODES,
  CountryCode,
  findByCode,
  findByPhone,
  stripDialCode,
} from '../../data/country-codes.data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-phone-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
  host: { style: 'display: block' },
  templateUrl: './phone-input.component.html',
})
export class PhoneInputComponent implements ControlValueAccessor, OnInit {
  // Inputs
  readonly defaultCountryCode = input<string>('LK');
  readonly placeholder = input<string>('Phone number');
  readonly inputId = input<string>('phone');
  readonly hasError = input<boolean>(false);

  // Internal state
  selectedCountry = signal<CountryCode>(COUNTRY_CODES.find((c) => c.code === 'LK')!);
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
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.searchQuery = '';
      this.filteredCountries.set(COUNTRY_CODES);
    }
  }

  onSearch(event: Event) {
    const q = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCountries.set(
      COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.dial.includes(q) ||
          c.code.toLowerCase().includes(q),
      ),
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
    const controlKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];
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
