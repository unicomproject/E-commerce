import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideShield, lucideShoppingBag, lucideChevronDown, lucideLock } from '@ng-icons/lucide';
import { CheckoutService } from '../../../../features/checkout/services/checkout.service';
import { CartService } from '../../../../features/cart/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthModalService } from '../../../../core/services/auth-modal.service';
import { CustomerProfileService } from '../../../../features/customer/services/customer-profile.service';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { PhoneInputComponent } from '../../../../shared/components/phone-input/phone-input.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    PriceComponent,
    PhoneInputComponent,
  ],
  viewProviders: [provideIcons({ lucideShield, lucideShoppingBag, lucideChevronDown, lucideLock })],
  template: `
    <div class="animate-in fade-in duration-300">
      <!-- Header -->
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-1">Customer Details</h2>
        <p class="text-gray-500 text-sm">
          Enter your contact information for order updates and collection.
        </p>
      </div>

      <form [formGroup]="detailsForm" (ngSubmit)="onSubmit()">
        <!-- First Name & Last Name -->
        <div class="grid grid-cols-1 gap-3 mb-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              First name <span class="text-brand-orange">*</span>
            </label>
            <input
              type="text"
              formControlName="firstName"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 font-bold text-gray-900 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
            />
            @if (detailsForm.get('firstName')?.touched && detailsForm.get('firstName')?.invalid) {
              <div class="text-red-500 text-xs mt-1">First name is required.</div>
            }
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Last name <span class="text-brand-orange">*</span>
            </label>
            <input
              type="text"
              formControlName="lastName"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 font-bold text-gray-900 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
            />
            @if (detailsForm.get('lastName')?.touched && detailsForm.get('lastName')?.invalid) {
              <div class="text-red-500 text-xs mt-1">Last name is required.</div>
            }
          </div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email address <span class="text-brand-orange">*</span>
          </label>
          <input
            type="email"
            formControlName="email"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-900 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
          />
          @if (detailsForm.get('email')?.touched && detailsForm.get('email')?.invalid) {
            <div class="text-red-500 text-xs mt-1">Valid email is required.</div>
          }
        </div>

        <!-- Mobile Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Mobile number <span class="text-brand-orange">*</span>
          </label>
          <app-phone-input
            formControlName="mobile"
            inputId="mobile"
            placeholder="Phone number"
            [hasError]="
              !!(detailsForm.get('mobile')?.touched && detailsForm.get('mobile')?.invalid)
            "
          ></app-phone-input>
          @if (detailsForm.get('mobile')?.touched && detailsForm.get('mobile')?.invalid) {
            <div class="text-red-500 text-xs mt-1">Mobile number is required.</div>
          }
        </div>

        <!-- Order Summary Preview -->
        @if (cartService.cart$ | async; as cart) {
          <div class="border border-gray-200 rounded-xl p-3 mb-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-gray-400 bg-gray-50 p-2 rounded-lg">
                <ng-icon name="lucideShoppingBag" size="20"></ng-icon>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 leading-tight">Order Summary</h4>
                <p class="text-gray-600 text-sm">
                  {{ cart.items.length }} items •
                  <app-price [value]="cart.grandTotal"></app-price>
                </p>
              </div>
            </div>
            <button
              type="button"
              (click)="checkoutService.closeCheckout()"
              class="text-brand-orange text-sm font-bold hover:underline"
            >
              Edit Cart
            </button>
          </div>
        }

        <!-- Actions -->
        <div
          class="sticky bottom-0 bg-white pt-4 pb-4 md:pb-6 z-10 -mx-6 px-6 -mb-6 space-y-2 border-t border-gray-100"
        >
          <button
            type="submit"
            [disabled]="checkoutService.isLoading()"
            class="w-full py-3 bg-brand-orange text-white font-bold text-lg rounded-xl hover:bg-brand-orange-dark transition-colors flex items-center justify-center disabled:opacity-70"
          >
            @if (checkoutService.isLoading()) {
              <span
                class="mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"
              ></span>
            }
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CheckoutDetailsComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private profileService = inject(CustomerProfileService);
  private fb = inject(FormBuilder);

  detailsForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
  });

  ngOnInit() {
    const session = this.checkoutService.checkoutSession();
    const user = this.authService.currentUserSnapshot;

    if (session) {
      const parts = session.pickupContactName ? session.pickupContactName.split(' ') : [];
      this.detailsForm.patchValue({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: session.pickupContactEmail || '',
        mobile: session.pickupContactPhone || '',
      });
    } else if (user) {
      this.detailsForm.patchValue({
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email || '',
        mobile: user.phone || '',
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
    this.checkoutService.getStores().subscribe((stores) => {
      let defaultOutletId = '00000000-0000-0000-0000-000000000000';
      if (stores && stores.length > 0) {
        const firstAvailable = stores.find((s) => s.isAvailable) || stores[0];
        defaultOutletId = firstAvailable.id;
      }

      this.checkoutService
        .createFromCart(
          {
            selectedOutletId: defaultOutletId,
            pickupContactName: `${val.firstName} ${val.lastName}`.trim(),
            pickupContactEmail: val.email!,
            pickupContactPhone: val.mobile!,
          },
          cartId,
          { nextStep: 3 }
        )
        .subscribe(() => {
          // Also save this permanently to the user's profile
          this.profileService.updateProfile({
            firstName: val.firstName!,
            lastName: val.lastName!,
            email: val.email!,
            phone: val.mobile!
          }).subscribe(() => {
            this.authService.refreshSession().subscribe();
          });
        });
    });
  }
}
