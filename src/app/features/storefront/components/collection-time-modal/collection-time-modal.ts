import { Component, input, output, signal, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX, lucideClock, lucideCalendar, lucideChevronRight } from '@ng-icons/lucide';
import { StorefrontDataService, CollectionOptions } from '../../services/storefront-data.service';

@Component({
  selector: 'app-collection-time-modal',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ lucideX, lucideClock, lucideCalendar, lucideChevronRight })],
  templateUrl: './collection-time-modal.html'
})
export class CollectionTimeModalComponent {
  isOpen = input<boolean>(false);
  outletId = input<string | null>(null);
  
  close = output<void>();
  confirm = output<{ type: 'asap' | 'later', date?: string, time?: string, isoString?: string }>();

  private dataService = inject(StorefrontDataService);

  // State
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  options = signal<CollectionOptions | null>(null);
  
  selectedOption = signal<'later'>('later');
  selectedDate = signal<string>('');
  selectedTime = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.isOpen() && this.outletId()) {
        this.fetchOptions(this.outletId()!);
      }
    }, { allowSignalWrites: true });
  }

  fetchOptions(oId: string) {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.dataService.getCollectionOptions(oId).subscribe({
      next: (opts) => {
        this.options.set(opts);
        if (opts.dates.length > 0) {
          this.selectedDate.set(opts.dates[0].date);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  // Computed Derivations
  dates = computed(() => {
    const opts = this.options();
    if (!opts) return [];
    return opts.dates.map(d => {
      const year = parseInt(d.date.substring(0, 4), 10);
      const month = parseInt(d.date.substring(5, 7), 10) - 1;
      const day = parseInt(d.date.substring(8, 10), 10);
      const safeDate = new Date(year, month, day);

      return {
        label: d.dayOfWeek.substring(0, 3), // e.g., 'Thu'
        day: safeDate.getDate().toString(),
        month: safeDate.toLocaleString('default', { month: 'short' }),
        value: d.date
      };
    });
  });

  times = computed(() => {
    const opts = this.options();
    const selDate = this.selectedDate();
    if (!opts || !selDate) return [];
    const dateObj = opts.dates.find(d => d.date === selDate);
    if (!dateObj) return [];
    
    return dateObj.windows.map(w => {
      const date = new Date(w.startAt);
      return {
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isoString: w.startAt
      };
    });
  });

  earliestTime = computed(() => {
    const opts = this.options();
    const slot = this.dataService.resolveEarliestBookableSlot(opts);
    if (!slot) return '...';
    return new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  closingTime = computed(() => {
    const opts = this.options();
    const selDate = this.selectedDate();
    if (!opts || !selDate) return '...';
    const dateObj = opts.dates.find(d => d.date === selDate);
    if (!dateObj) return '...';
    
    return this.formatTimeOnly(dateObj.closingTime);
  });

  formatTimeOnly(timeString: string): string {
    if (!timeString) return '';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    const d = new Date();
    d.setHours(parseInt(parts[0], 10));
    d.setMinutes(parseInt(parts[1], 10));
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
    this.selectedTime.set(null); // Reset time when date changes
  }

  selectTime(time: string) {
    this.selectedTime.set(time);
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    if (this.selectedTime()) {
      const selDateObj = this.dates().find(d => d.value === this.selectedDate());
      const displayDate = selDateObj ? `${selDateObj.label} ${selDateObj.day} ${selDateObj.month}` : this.selectedDate();
      
      const selTimeObj = this.times().find(t => t.time === this.selectedTime());
      
      this.confirm.emit({ 
        type: 'later', 
        date: displayDate, 
        time: this.selectedTime()!,
        isoString: selTimeObj?.isoString 
      });
    }
  }
}
