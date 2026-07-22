import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideMapPin, lucideCalendar, lucideClock, lucideChevronRight } from '@ng-icons/lucide';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { 
  StorefrontStoreReadModel, 
  StorefrontCollectionDateReadModel,
  StorefrontCollectionWindowReadModel
} from '../../../../core/models/checkout.model';

@Component({
  selector: 'app-checkout-collection',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideInfo, lucideMapPin, lucideCalendar, lucideClock, lucideChevronRight })],
  template: `
    <div class="animate-in fade-in duration-300">
      
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Collection Details</h2>
        <p class="text-gray-500 text-sm">Choose your collection outlet, date and time for pickup.</p>
      </div>

      <!-- 1. Select Outlet -->
      <div class="mb-8">
        <h3 class="text-md font-bold text-gray-900 mb-3">1. Selected collection outlet</h3>
        
        @if (checkoutService.isLoading() && !checkoutService.availableStores().length) {
          <div class="w-full h-32 bg-gray-100 animate-pulse rounded-xl"></div>
        } @else {
          <div class="grid gap-3">
            @for (store of checkoutService.availableStores(); track store.id) {
              <div 
                class="border-2 rounded-xl p-4 cursor-pointer transition-colors flex items-start gap-4"
                [ngClass]="{
                  'border-brand-orange bg-orange-50/30': selectedOutletId() === store.id,
                  'border-gray-200 hover:border-gray-300 bg-white': selectedOutletId() !== store.id,
                  'opacity-50 pointer-events-none': !store.isAvailable
                }"
                (click)="selectOutlet(store.id)"
              >
                <!-- Fake Store Image for UI -->
                <div class="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
                  <ng-icon name="lucideMapPin" size="24"></ng-icon>
                </div>
                
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-gray-900">{{ store.name }}</h4>
                    @if (selectedOutletId() === store.id) {
                      <span class="text-brand-orange text-sm font-bold">Selected</span>
                    }
                  </div>
                  <p class="text-gray-500 text-sm mt-1 mb-2">{{ store.address }}</p>
                  <div class="flex items-center text-xs">
                    <div class="w-2 h-2 rounded-full mr-2" [ngClass]="store.isOpen ? 'bg-green-500' : 'bg-red-500'"></div>
                    <span [ngClass]="store.isOpen ? 'text-green-600' : 'text-red-600 font-medium'">
                      {{ store.isOpen ? 'Open now' : 'Closed' }}
                    </span>
                    @if (store.isOpen) {
                      <span class="text-gray-400 mx-2">|</span>
                      <span class="text-gray-500">Collection available in as little as {{ store.preparationLeadMinutes }} mins</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Info Banner -->
        <div class="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 items-start mt-4">
          <div class="text-brand-orange mt-0.5 shrink-0">
            <ng-icon name="lucideInfo" size="20"></ng-icon>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Important</h4>
            <p class="text-gray-600 text-sm mt-0.5">Changing the collection outlet may affect item availability. Some items in your cart may not be available at the new outlet.</p>
          </div>
        </div>
      </div>

      @if (checkoutService.collectionOptions()) {
        <!-- 2. Select Date -->
        <div class="mb-8">
          <h3 class="text-md font-bold text-gray-900 mb-3">2. Select collection date</h3>
          <div class="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
            @for (dateObj of checkoutService.collectionOptions()?.dates; track dateObj.date) {
              <div 
                class="flex flex-col items-center justify-center min-w-[100px] h-16 border-2 rounded-xl cursor-pointer transition-colors shrink-0"
                [ngClass]="{
                  'border-brand-orange bg-orange-50 text-brand-orange': selectedDate()?.date === dateObj.date,
                  'border-gray-200 hover:border-gray-300 text-gray-900 bg-white': selectedDate()?.date !== dateObj.date
                }"
                (click)="selectDate(dateObj)"
              >
                <span class="font-bold text-sm">{{ getFriendlyDayName(dateObj.date) }}</span>
                <span class="text-xs" [ngClass]="selectedDate()?.date === dateObj.date ? 'text-brand-orange' : 'text-gray-500'">{{ formatDate(dateObj.date) }}</span>
              </div>
            }
          </div>
        </div>

        <!-- 3. Available Time Slots -->
        @if (selectedDate()) {
          <div class="mb-8">
            <div class="flex justify-between items-end mb-3">
              <h3 class="text-md font-bold text-gray-900">3. Available time slots</h3>
              <div class="flex items-center text-gray-500 text-xs">
                <ng-icon name="lucideClock" size="14" class="mr-1"></ng-icon>
                All slots are 30 mins
              </div>
            </div>
            
            <p class="text-sm text-gray-500 mb-3">For {{ checkoutService.collectionOptions()?.outletName }} • {{ formatDate(selectedDate()!.date) }}</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              @for (window of selectedDate()!.windows; track window.startAt) {
                <div 
                  class="flex flex-col items-center justify-center h-12 border-2 rounded-xl cursor-pointer transition-colors"
                  [ngClass]="{
                    'border-brand-orange bg-orange-50 text-brand-orange font-bold': selectedTime()?.startAt === window.startAt,
                    'border-gray-200 hover:border-gray-300 text-gray-900 font-medium bg-white': selectedTime()?.startAt !== window.startAt
                  }"
                  (click)="selectTime(window)"
                >
                  <span class="text-sm">{{ formatTime(window.startAt) }}</span>
                  @if (selectedTime()?.startAt === window.startAt) {
                    <span class="text-[10px] text-brand-orange leading-none mt-0.5">Selected</span>
                  }
                </div>
              }
            </div>
          </div>
        }
      }

      <!-- Collection Instructions -->
      <div class="border border-gray-200 bg-white rounded-xl p-4 flex gap-4 items-start mb-4">
        <div class="text-brand-orange bg-orange-50 p-2 rounded-lg shrink-0">
          <ng-icon name="lucideCalendar" size="24"></ng-icon>
        </div>
        <div>
          <h4 class="font-bold text-gray-900">Collection instructions</h4>
          <p class="text-gray-600 text-sm mt-0.5">Please arrive within 15 minutes of your selected time and bring your order confirmation.</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-3 pt-4 border-t border-gray-100 mt-6">
        <button 
          type="button" 
          [disabled]="checkoutService.isLoading() || !selectedTime()"
          (click)="onContinue()"
          class="w-full py-4 bg-brand-orange text-white font-bold text-lg rounded-xl hover:bg-brand-orange-dark transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          <span *ngIf="checkoutService.isLoading()" class="mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
          Continue to Order Review
          <ng-icon name="lucideChevronRight" size="20" class="ml-2 group-hover:translate-x-1 transition-transform" *ngIf="!checkoutService.isLoading()"></ng-icon>
        </button>
        
        <button 
          type="button" 
          (click)="checkoutService.setStep(1)"
          class="w-full py-4 bg-white text-brand-orange border-2 border-orange-100 font-bold text-lg rounded-xl hover:bg-orange-50 transition-colors"
        >
          Back to Customer Details
        </button>
      </div>

    </div>
  `
})
export class CheckoutCollectionComponent implements OnInit {
  checkoutService = inject(CheckoutService);

  selectedOutletId = signal<string | null>(null);
  selectedDate = signal<StorefrontCollectionDateReadModel | null>(null);
  selectedTime = signal<StorefrontCollectionWindowReadModel | null>(null);

  constructor() {
    // When outlet changes, load options
    effect(() => {
      const outletId = this.selectedOutletId();
      if (outletId) {
        // Fetch 7 days from backend to account for closed days, but only show 4 in UI
        this.checkoutService.getCollectionOptions(outletId, 7).subscribe(opts => {
          if (opts && opts.dates.length > 0) {
            opts.dates = opts.dates.slice(0, 4);
            this.selectedDate.set(opts.dates[0]);
            if (opts.dates[0].windows.length > 0) {
              this.selectedTime.set(opts.dates[0].windows[0]);
            }
          }
        });
      }
    });
  }

  ngOnInit() {
    this.checkoutService.getStores().subscribe(stores => {
      if (stores && stores.length > 0) {
        // Auto select first available store
        const firstAvailable = stores.find(s => s.isAvailable) || stores[0];
        this.selectedOutletId.set(firstAvailable.id);
      }
    });
  }

  selectOutlet(id: string) {
    this.selectedOutletId.set(id);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
  }

  selectDate(dateObj: StorefrontCollectionDateReadModel) {
    this.selectedDate.set(dateObj);
    this.selectedTime.set(null);
  }

  selectTime(window: StorefrontCollectionWindowReadModel) {
    this.selectedTime.set(window);
  }

  onContinue() {
    const outletId = this.selectedOutletId();
    const time = this.selectedTime();
    
    if (!outletId || !time) return;

    this.checkoutService.updateCollection({
      selectedOutletId: outletId,
      requestedCollectionAt: time.startAt
    }).subscribe();
  }

  // Helpers
  getFriendlyDayName(dateStr: string): string {
    // Avoid timezone shift by parsing exactly as local parts
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  }

  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  formatTime(isoString: string): string {
    // Extract the exact time part from the ISO string to show store's local time
    // e.g. "2026-07-23T09:00:00+01:00" -> "09:00"
    const timePart = isoString.includes('T') ? isoString.split('T')[1].substring(0, 5) : '';
    if (timePart) {
      let [hours, minutes] = timePart.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    // Fallback
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}
