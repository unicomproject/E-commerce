import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
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
  route: string;
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
export class Account {
  user = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+44 7700 900123'
  };

  quickActions: QuickAction[] = [
    { label: 'Personal Information', icon: 'lucideUser', route: '/account/profile' },
    { label: 'Address Book', icon: 'lucideMapPin', route: '/account/addresses' },
    { label: 'My Orders', icon: 'lucideShoppingBag', route: '/account/orders' },
    { label: 'Notification Centre', icon: 'lucideBell', route: '/account/notifications' },
    { label: 'Preferences', icon: 'lucideSettings', route: '/account/preferences' },
    { label: 'Change Password', icon: 'lucideLock', route: '/account/security' },
    { label: 'Help & Support', icon: 'lucideHelpCircle', route: '/support' },
    { label: 'Logout', icon: 'lucideLogOut', route: '/logout', isDestructive: true },
  ];
}
