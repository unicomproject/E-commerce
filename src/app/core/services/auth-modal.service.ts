import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AuthView = 'login' | 'register' | 'forgot-password' | 'verify' | 'reset-password';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private viewSubject = new BehaviorSubject<AuthView>('login');
  view$ = this.viewSubject.asObservable();

  open(view: AuthView = 'login') {
    this.viewSubject.next(view);
    this.isOpenSubject.next(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpenSubject.next(false);
    // Restore body scroll
    document.body.style.overflow = '';
  }

  switchView(view: AuthView) {
    this.viewSubject.next(view);
  }
}
