import { Injectable, signal, effect, inject } from '@angular/core';
import { BodyScrollLockService } from '../../../core/services/body-scroll-lock.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryModalService {
  private bodyScrollLock = inject(BodyScrollLockService);
  private _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();

  constructor() {
    let wasOpen = false;
    effect(() => {
      const open = this._isOpen();
      if (open && !wasOpen) this.bodyScrollLock.lock();
      if (!open && wasOpen) this.bodyScrollLock.unlock();
      wasOpen = open;
    });
  }

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}
