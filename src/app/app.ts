import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal';
import { CheckoutModalComponent } from './features/checkout/components/checkout-modal/checkout-modal';
import { ToastComponent } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, BottomNav, AuthModalComponent, CheckoutModalComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('e-commerce-app');
}
