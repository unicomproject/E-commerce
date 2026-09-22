import { Injectable } from '@angular/core';

/**
 * Reference-counted body scroll lock, shared by every modal/bottom-sheet in
 * the app. A plain boolean toggle would be wrong here: modals can legitimately
 * be open at the same time (e.g. the outlet-selector modal opened from within
 * the checkout modal), and if each just set/cleared document.body.style
 * directly, whichever closed last would win regardless of what else was still
 * open. Counting locks/unlocks keeps scroll disabled until the last open
 * modal closes.
 */
@Injectable({ providedIn: 'root' })
export class BodyScrollLockService {
  private lockCount = 0;

  lock(): void {
    this.lockCount++;
    if (this.lockCount === 1) {
      document.body.style.overflow = 'hidden';
    }
  }

  unlock(): void {
    if (this.lockCount === 0) return;
    this.lockCount--;
    if (this.lockCount === 0) {
      document.body.style.overflow = '';
    }
  }
}
