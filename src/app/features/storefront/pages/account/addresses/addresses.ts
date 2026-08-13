import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucidePlus, lucideTrash2, lucideEdit2, lucideCheck, lucideX } from '@ng-icons/lucide';
import { CustomerAddressService } from '../../../../../core/services/customer-address.service';
import { CustomerAddressDto, CreateCustomerAddressRequest, UpdateCustomerAddressRequest } from '../../../../../core/models/customer-address.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { MobileHeaderComponent } from '../../../../../shared/components/mobile-header/mobile-header.component';
import { PhoneInputComponent } from '../../../../../shared/components/phone-input/phone-input.component';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, PhoneInputComponent, MobileHeaderComponent],
  templateUrl: './addresses.html',
  viewProviders: [provideIcons({ lucideMapPin, lucidePlus, lucideTrash2, lucideEdit2, lucideCheck, lucideX })]
})
export class AddressesComponent implements OnInit {
  private addressService = inject(CustomerAddressService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/account']);
  }

  addresses = signal<CustomerAddressDto[]>([]);
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);

  showForm = signal<boolean>(false);
  editingId = signal<string | null>(null);

  addressForm: FormGroup;

  constructor() {
    this.addressForm = this.fb.group({
      contactName: ['', [Validators.required, Validators.maxLength(150)]],
      contactPhone: ['', [Validators.required, Validators.maxLength(50)]],
      addressLine1: ['', [Validators.required, Validators.maxLength(200)]],
      addressLine2: ['', [Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      postalCode: ['', [Validators.required, Validators.maxLength(20)]],
      countryCode: ['', [Validators.required, Validators.maxLength(2)]],
      addressType: ['HOME', [Validators.required]],
      isDefaultShipping: [false],
      isDefaultBilling: [false]
    });
  }

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.isLoading.set(true);
    this.addressService.getAddresses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.addresses.set(response.data);
          if (response.data.length === 0) {
            this.openNewForm();
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load addresses');
        this.isLoading.set(false);
      }
    });
  }

  openNewForm() {
    this.editingId.set(null);
    this.addressForm.reset({
      addressType: 'HOME',
      isDefaultShipping: this.addresses().length === 0,
      isDefaultBilling: this.addresses().length === 0
    });
    this.showForm.set(true);
  }

  openEditForm(address: CustomerAddressDto) {
    this.editingId.set(address.id);
    this.addressForm.patchValue({
      contactName: address.contactName,
      contactPhone: address.contactPhone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      countryCode: address.countryCode,
      addressType: address.addressType,
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling
    });
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  saveAddress() {
    if (this.addressForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.addressForm.value;

    if (this.editingId()) {
      const request: UpdateCustomerAddressRequest = { ...formValue };
      this.addressService.updateAddress(this.editingId()!, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success('Address updated successfully');
            this.loadAddresses();
            this.cancelForm();
          }
          this.isSaving.set(false);
        },
        error: () => {
          this.toast.error('Failed to update address');
          this.isSaving.set(false);
        }
      });
    } else {
      const request: CreateCustomerAddressRequest = { ...formValue };
      this.addressService.createAddress(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success('Address created successfully');
            this.loadAddresses();
            this.cancelForm();
          }
          this.isSaving.set(false);
        },
        error: () => {
          this.toast.error('Failed to create address');
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteAddress(id: string) {
    if (!confirm('Are you sure you want to delete this address?')) return;

    this.addressService.deleteAddress(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toast.success('Address deleted successfully');
          this.loadAddresses();
        }
      },
      error: () => {
        this.toast.error('Failed to delete address');
      }
    });
  }

  setDefault(id: string, type: 'SHIPPING' | 'BILLING') {
    this.addressService.setDefaultAddress(id, type).subscribe({
      next: (response) => {
        if (response.success) {
          this.toast.success(`Default ${type.toLowerCase()} address updated`);
          this.loadAddresses();
        }
      },
      error: () => {
        this.toast.error('Failed to update default address');
      }
    });
  }
}
