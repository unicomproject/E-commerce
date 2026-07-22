import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideShield, lucideShoppingBag, lucideChevronDown, lucideLock } from '@ng-icons/lucide';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthModalService } from '../../../../core/services/auth-modal.service';
import { TenantCurrencyPipe } from '../../../../shared/pipes/tenant-currency.pipe';

@Component({
  selector: 'app-checkout-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, TenantCurrencyPipe],
  viewProviders: [provideIcons({ lucideShield, lucideShoppingBag, lucideChevronDown, lucideLock })],
  template: `
    <div class="animate-in fade-in duration-300">
      
      <!-- Header -->
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Customer Details</h2>
        <p class="text-gray-500 text-sm">Enter your contact information for order updates and collection.</p>
      </div>

      <form [formGroup]="detailsForm" (ngSubmit)="onSubmit()">
        
        <!-- First Name & Last Name -->
        <div class="grid grid-cols-1 gap-3 mb-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              First name <span class="text-brand-orange">*</span>
            </label>
            <input type="text" formControlName="firstName" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors">
            <div *ngIf="detailsForm.get('firstName')?.touched && detailsForm.get('firstName')?.invalid" class="text-red-500 text-xs mt-1">First name is required.</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Last name <span class="text-brand-orange">*</span>
            </label>
            <input type="text" formControlName="lastName" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors">
            <div *ngIf="detailsForm.get('lastName')?.touched && detailsForm.get('lastName')?.invalid" class="text-red-500 text-xs mt-1">Last name is required.</div>
          </div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email address <span class="text-brand-orange">*</span>
          </label>
          <input type="email" formControlName="email" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors">
          <div *ngIf="detailsForm.get('email')?.touched && detailsForm.get('email')?.invalid" class="text-red-500 text-xs mt-1">Valid email is required.</div>
        </div>

        <!-- Mobile Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Mobile number <span class="text-brand-orange">*</span>
          </label>
          <div class="flex flex-col md:flex-row gap-3">
            <!-- Country Code Dropdown -->
            <div class="relative w-full md:w-32 flex-shrink-0">
              <div class="w-full px-3 py-2.5 rounded-lg border border-gray-300 flex items-center justify-between bg-white cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-2">
                  <span class="text-lg leading-none">🇬🇧</span>
                  <span class="text-gray-900 font-medium">+44</span>
                </div>
                <ng-icon name="lucideChevronDown" size="16" class="text-gray-500"></ng-icon>
              </div>
            </div>
            <!-- Input -->
            <div class="w-full relative">
              <input type="tel" formControlName="mobile" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors">
              <div *ngIf="detailsForm.get('mobile')?.touched && detailsForm.get('mobile')?.invalid" class="text-red-500 text-xs mt-1 absolute -bottom-5">Mobile number is required.</div>
            </div>
          </div>
        </div>

        <!-- Save Details Checkbox -->
        <div class="mb-4">
          <label class="flex items-center space-x-3 cursor-pointer group">
            <input type="checkbox" formControlName="saveDetails" class="w-5 h-5 rounded border-gray-300 text-brand-orange focus:ring-brand-orange transition-colors">
            <span class="text-gray-900 font-medium group-hover:text-brand-orange transition-colors">Save these details for faster checkout next time</span>
          </label>
        </div>

        <!-- Secure Banner -->
        <div class="bg-orange-50 border border-orange-100 rounded-xl p-3 flex gap-3 items-start mb-4">
          <div class="text-brand-orange bg-white p-2 rounded-full shadow-sm shrink-0">
            <ng-icon name="lucideShield" size="20"></ng-icon>
          </div>
          <div>
            <h4 class="font-bold text-gray-900">Your information is secure</h4>
            <p class="text-gray-600 text-sm mt-0.5">We use encryption to protect your data and never share it.</p>
          </div>
        </div>

        <!-- Order Summary Preview -->
        <div class="border border-gray-200 rounded-xl p-3 mb-4 flex items-center justify-between" *ngIf="cartService.cart$ | async as cart">
          <div class="flex items-center gap-3">
            <div class="text-gray-400 bg-gray-50 p-2 rounded-lg">
              <ng-icon name="lucideShoppingBag" size="20"></ng-icon>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 leading-tight">Order Summary</h4>
              <p class="text-gray-600 text-sm">{{ cart.items.length }} items • {{ cart.grandTotal | tenantCurrency:'symbol':'1.2-2' }}</p>
            </div>
          </div>
          <button type="button" (click)="checkoutService.closeCheckout()" class="text-brand-orange text-sm font-bold hover:underline">
            Edit Cart
          </button>
        </div>

        <!-- Actions -->
        <div class="space-y-2 pt-2">
          <button 
            type="submit" 
            [disabled]="checkoutService.isLoading()"
            class="w-full py-3 bg-brand-orange text-white font-bold text-lg rounded-xl hover:bg-brand-orange-dark transition-colors flex items-center justify-center disabled:opacity-70"
          >
            <span *ngIf="checkoutService.isLoading()" class="mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
            Continue to Collection Outlet
          </button>
          
          <button 
            type="button" 
            (click)="checkoutService.closeCheckout()"
            class="w-full py-3 bg-white text-brand-orange border-2 border-orange-100 font-bold text-lg rounded-xl hover:bg-orange-50 transition-colors"
          >
            Back to Cart
          </button>
        </div>

      </form>
    </div>
  `
})
export class CheckoutDetailsComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private fb = inject(FormBuilder);

  detailsForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    saveDetails: [true]
  });

  ngOnInit() {
    const user = this.authService.currentUserSnapshot;
    if (user) {
      this.detailsForm.patchValue({
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email || '',
        mobile: user.phone || ''
      });
    }
  }

  onSubmit() {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }

    if (!this.authService.isAuthenticated) {
      this.authModalService.open('login');
      return;
    }

    const val = this.detailsForm.value;
    const cartId = localStorage.getItem('cartSessionId') ?? undefined;
    
    // We need to provide a selectedOutletId to create the checkout session
    // We fetch the available stores and default to the first one. The user can change it in the next step.
    this.checkoutService.getStores().subscribe(stores => {
      let defaultOutletId = '00000000-0000-0000-0000-000000000000';
      if (stores && stores.length > 0) {
        const firstAvailable = stores.find(s => s.isAvailable) || stores[0];
        defaultOutletId = firstAvailable.id;
      }
      
      this.checkoutService.createFromCart({
        selectedOutletId: defaultOutletId,
        pickupContactName: `${val.firstName} ${val.lastName}`.trim(),
        pickupContactEmail: val.email!,
        pickupContactPhone: val.mobile!
      }, cartId).subscribe();
    });
  }
}
