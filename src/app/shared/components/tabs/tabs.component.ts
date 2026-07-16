import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html'
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTabId: string = '';
  @Input() theme: 'plain' | 'shaded' = 'plain';
  @Output() activeTabIdChange = new EventEmitter<string>();

  selectTab(id: string) {
    this.activeTabId = id;
    this.activeTabIdChange.emit(id);
  }

  getTabClass(id: string): string {
    const isActive = this.activeTabId === id;
    if (this.theme === 'shaded') {
      const base = 'whitespace-nowrap px-6 py-3 text-sm font-medium border-b-2 transition-colors ';
      return base + (isActive ? 'border-brand-orange text-brand-orange bg-brand-orange-light/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300');
    } else {
      const base = 'whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors ';
      return base + (isActive ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300');
    }
  }
}
