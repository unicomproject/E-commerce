import { Component, signal , ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header.component';
import { BottomNav } from './layout/bottom-nav/bottom-nav.component';
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal.component';
import { CheckoutModalComponent } from './features/checkout/components/checkout-modal/checkout-modal.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CategoryBottomSheetComponent } from './features/catalog/components/category-bottom-sheet/category-bottom-sheet.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, Header, BottomNav, AuthModalComponent, CheckoutModalComponent, ToastComponent, CategoryBottomSheetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('e-commerce-app');
}
