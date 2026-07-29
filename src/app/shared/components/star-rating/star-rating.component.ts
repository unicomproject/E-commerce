import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html'
})
export class StarRatingComponent {
  readonly rating = input(0);
  readonly size = input(14);
}