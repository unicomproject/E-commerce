import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center w-full mb-6">
      <div class="flex items-center w-full max-w-sm justify-between relative">
        @for (step of steps; track step.num; let i = $index) {
          <!-- Step Circle -->
          <div class="flex flex-col items-center relative z-10 bg-white px-2">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 border-2"
              [ngClass]="{
                'bg-brand-orange text-white border-brand-orange': currentStep() >= step.num,
                'bg-white text-gray-400 border-gray-300': currentStep() < step.num
              }">
              @if (currentStep() > step.num) {
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              } @else {
                {{ step.num }}
              }
            </div>
            <span 
              class="text-[10px] mt-1 font-medium transition-colors duration-300"
              [ngClass]="{
                'text-brand-orange': currentStep() >= step.num,
                'text-gray-400': currentStep() < step.num
              }">
              {{ step.label }}
            </span>
          </div>

          <!-- Connecting Line -->
          @if (i < steps.length - 1) {
            <div class="flex-1 h-[2px] mx-1 transition-colors duration-300 relative z-0 mt-[-16px]"
                 [ngClass]="{
                   'bg-brand-orange': currentStep() > step.num,
                   'bg-gray-200': currentStep() <= step.num
                 }">
            </div>
          }
        }
      </div>
    </div>
  `
})
export class CheckoutStepperComponent {
  currentStep = input<number>(1);
  
  steps = [
    { num: 1, label: 'Details' },
    { num: 2, label: 'Collection' },
    { num: 3, label: 'Review' },
    { num: 4, label: 'Confirm' }
  ];
}
