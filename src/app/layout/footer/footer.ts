import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { simpleFacebook, simpleX } from '@ng-icons/simple-icons';

@Component({
  selector: 'app-footer',
  imports: [NgIcon],
  viewProviders: [provideIcons({ simpleFacebook, simpleX })],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
