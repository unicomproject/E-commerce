import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideCheckCircle2, lucideShoppingBag, lucideHeart, lucideX, lucideInfo } from '@ng-icons/lucide';
import { CartService } from '../../../../core/services/cart.service';
import { QuantityStepperComponent } from '../../../../shared/components/quantity-stepper/quantity-stepper.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, QuantityStepperComponent],
  templateUrl: './cart.html',
  viewProviders: [provideIcons({ lucideTrash2, lucideCheckCircle2, lucideShoppingBag, lucideHeart, lucideX, lucideInfo })]
})
export class Cart implements OnInit {
  private cartService = inject(CartService);

  cart$ = this.cartService.cart$;
  itemToRemove: any | null = null;

  ngOnInit() {
    this.cartService.loadCart();
  }

  updateQuantity(itemId: string, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(item: any) {
    this.itemToRemove = item;
    // Prevent body scrolling on mobile when modal is open
    document.body.style.overflow = 'hidden';
  }

  confirmRemove() {
    if (this.itemToRemove) {
      this.cartService.removeItem(this.itemToRemove.id);
      this.closeModal();
    }
  }

  cancelRemove() {
    this.closeModal();
  }

  moveToWishlist() {
    // Placeholder for wishlist logic
    if (this.itemToRemove) {
      this.cartService.removeItem(this.itemToRemove.id);
      console.log('Moved to wishlist:', this.itemToRemove);
      this.closeModal();
    }
  }

  private closeModal() {
    this.itemToRemove = null;
    document.body.style.overflow = 'auto';
  }
}
