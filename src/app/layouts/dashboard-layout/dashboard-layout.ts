import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { catchError, of } from 'rxjs';

interface DashboardNavItem {
  label: string;
  path: string;
  icon: string;
  description: string;
  exact?: boolean;
}

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout implements OnInit {

  role = '';
  userName = 'Worknest member';
  userEmail = 'Open profile';
  isSidebarOpen = false;

  private readonly navConfig: Record<string, DashboardNavItem[]> = {
    User: [
      {
        label: 'Overview',
        path: '/dashboard/user',
        icon: 'bi bi-grid',
        description: 'Your bookings and quick actions',
        exact: true,
      },
      {
        label: 'Browse Spaces',
        path: '/dashboard/user/browse',
        icon: 'bi bi-building',
        description: 'Explore workspaces by type and capacity',
      },
      {
        label: 'My Bookings',
        path: '/dashboard/user/bookings',
        icon: 'bi bi-calendar-check',
        description: 'Manage upcoming reservations',
      },
      {
        label: 'Become an Owner',
        path: '/dashboard/user/request-owner',
        icon: 'bi bi-arrow-up-right-circle',
        description: 'Apply to list and manage spaces',
      },
      {
        label: 'Profile',
        path: '/dashboard/profile',
        icon: 'bi bi-person-circle',
        description: 'View your personal account details',
      },
    ],
    Owner: [
      {
        label: 'Portfolio',
        path: '/dashboard/owner/spaces',
        icon: 'bi bi-buildings',
        description: 'Track your listed spaces',
      },
      {
        label: 'Add Space',
        path: '/dashboard/owner/add-space',
        icon: 'bi bi-plus-circle',
        description: 'Publish a new space to the marketplace',
      },
      {
        label: 'Bookings',
        path: '/dashboard/owner/bookings',
        icon: 'bi bi-journal-check',
        description: 'Approve and monitor reservations',
      },
      {
        label: 'Earnings',
        path: '/dashboard/owner/earnings',
        icon: 'bi bi-cash-coin',
        description: 'See revenue and payout momentum',
      },
      {
        label: 'Profile',
        path: '/dashboard/profile',
        icon: 'bi bi-person-circle',
        description: 'View your personal account details',
      },
    ],
    Admin: [
      {
        label: 'Overview',
        path: '/dashboard/admin',
        icon: 'bi bi-speedometer2',
        description: 'Platform health and approval queues',
        exact: true,
      },
      {
        label: 'Owner Requests',
        path: '/dashboard/admin/owner-requests',
        icon: 'bi bi-person-check',
        description: 'Review access upgrade requests',
      },
      {
        label: 'Manage Spaces',
        path: '/dashboard/admin/spaces',
        icon: 'bi bi-columns-gap',
        description: 'Moderate pending and inactive spaces',
      },
      {
        label: 'Users',
        path: '/dashboard/admin/users',
        icon: 'bi bi-people',
        description: 'Track user growth and roles',
      },
      {
        label: 'Bookings',
        path: '/dashboard/admin/bookings',
        icon: 'bi bi-receipt',
        description: 'Monitor activity across the marketplace',
      },
      {
        label: 'Profile',
        path: '/dashboard/profile',
        icon: 'bi bi-person-circle',
        description: 'View your personal account details',
      },
    ],
  };

  constructor(private authService: AuthService,
              private router: Router){
    this.role = this.authService.getRole() || '';
  }

  ngOnInit() {
    this.authService.getCurrentUser()
      .pipe(catchError(() => of(null)))
      .subscribe((user) => {
        const firstName = user?.first_name || user?.name?.split(' ')?.[0];
        this.userName = firstName || `${this.role || 'Worknest'} member`;
        this.userEmail = user?.email || 'Open profile';
      });
  }

  get userInitials(): string {
    return this.userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  get navItems(): DashboardNavItem[] {
    return this.navConfig[this.role] ?? [];
  }

  get roleDescription(): string {
    if (this.role === 'Admin') {
      return 'Keep the marketplace healthy, verified, and moving.';
    }

    if (this.role === 'Owner') {
      return 'Operate your portfolio, bookings, and earnings from one place.';
    }

    return 'Discover spaces, manage reservations, and grow into hosting.';
  }

  get currentHeading(): string {
    if (this.router.url.startsWith('/dashboard/profile')) {
      return 'Profile';
    }

    const matchedItem = this.navItems.find((item) =>
      item.exact ? this.router.url === item.path : this.router.url.startsWith(item.path)
    );

    return matchedItem?.label || 'Dashboard';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout(){
    this.authService.logout();
    this.closeSidebar();
    this.router.navigate(['/login']);
  }
}
