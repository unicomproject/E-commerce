import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideHeart, lucideShoppingCart, lucideUser } from '@ng-icons/lucide';

@Component({
  selector: 'app-header',
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideSearch, lucideHeart, lucideShoppingCart, lucideUser })],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
