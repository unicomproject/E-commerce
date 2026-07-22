import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerLoginCustomerDto } from '../../../../core/models';
import { 
  lucideUser, 
  lucideMail, 
  lucidePhone, 
  lucidePackage, 
  lucideChevronRight,
  lucideMapPin,
  lucideShoppingBag,
  lucideBell,
  lucideSettings,
  lucideLock,
  lucideHelpCircle,
  lucideLogOut,
  lucideHeadphones
} from '@ng-icons/lucide';

interface QuickAction {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  templateUrl: './account.html',
  styleUrl: './account.css',
  viewProviders: [provideIcons({ 
    lucideUser, 
    lucideMail, 
    lucidePhone, 
    lucidePackage, 
    lucideChevronRight,
    lucideMapPin,
    lucideShoppingBag,
    lucideBell,
    lucideSettings,
    lucideLock,
    lucideHelpCircle,
    lucideLogOut,
    lucideHeadphones
  })]
})
export class Account implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: CustomerLoginCustomerDto | null = null;

  quickActions: QuickAction[] = [
    { label: 'Personal Information', icon: 'lucideUser', route: '/account/profile' },
    { label: 'Address Book', icon: 'lucideMapPin', route: '/account/addresses' },
    { label: 'My Orders', icon: 'lucideShoppingBag', route: '/account/orders' },
    { label: 'Logout', icon: 'lucideLogOut', action: () => this.logout(), isDestructive: true },
  ];

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
  
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
