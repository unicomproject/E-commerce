import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal';
import { CheckoutModalComponent } from './features/checkout/components/checkout-modal/checkout-modal';
import { ToastComponent } from './shared/components/toast/toast';
import { CategoryBottomSheetComponent } from './features/storefront/components/category-bottom-sheet/category-bottom-sheet';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, BottomNav, AuthModalComponent, CheckoutModalComponent, ToastComponent, CategoryBottomSheetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('e-commerce-app');
}
