import { Component , ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { simpleFacebook, simpleX } from '@ng-icons/simple-icons';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  imports: [NgIcon],
  viewProviders: [provideIcons({ simpleFacebook, simpleX })],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class Footer {}
