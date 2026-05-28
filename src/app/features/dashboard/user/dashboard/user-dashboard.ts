import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../../core/services/booking.service';
import { SpaceService } from '../../../../core/services/space.service';
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';

interface DashboardSpace {
  space_id: string;
  space_name: string;
  location: string;
  max_capacity: number;
  space_type: string;
}

interface DashboardBooking {
  booking_id: string;
  space_name: string;
  booking_date?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  booking_type?: string;
  total_amount?: number;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit, OnDestroy {

  firstName = 'there';
  role = '';
  spaces: DashboardSpace[] = [];
  bookings: DashboardBooking[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private spaceService: SpaceService
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole() || '';

    forkJoin({
      user:     this.authService.getCurrentUser().pipe(catchError(() => of(null))),
      spaces:   this.spaceService.getSpaces().pipe(catchError(() => of([]))),
      bookings: this.bookingService.getMyBookings().pipe(catchError(() => of([]))),
    }).pipe(takeUntil(this.destroy$)).subscribe(({ user, spaces, bookings }) => {
      this.firstName = user?.first_name || user?.name?.split(' ')?.[0] || 'there';
      this.spaces    = this.normalizeSpaces(spaces);
      this.bookings  = this.normalizeBookings(bookings);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get activeBookingsCount(): number {
    return this.bookings.filter((booking) =>
      ['pending', 'confirmed'].includes((booking.status || '').toLowerCase())
    ).length;
  }

  get completedBookingsCount(): number {
    return this.bookings.filter(
      (booking) => (booking.status || '').toLowerCase() === 'completed'
    ).length;
  }

  get availableTypesCount(): number {
    return new Set(
      this.spaces.map((space) => this.formatSpaceType(space.space_type))
    ).size;
  }

  get recentBookings(): DashboardBooking[] {
    return [...this.bookings]
      .sort((a, b) => this.getBookingDateValue(b) - this.getBookingDateValue(a))
      .slice(0, 3);
  }

  get topWorkspaceTypes(): Array<{ label: string; count: number }> {
    const counts = this.spaces.reduce<Record<string, number>>((acc, space) => {
      const label = this.formatSpaceType(space.space_type);
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  formatSpaceType(type: string | undefined): string {
    if (!type) {
      return 'Workspace';
    }

    return type
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  getBookingDateLabel(booking: DashboardBooking): string {
    return booking.booking_date || booking.start_date || booking.end_date || 'Date pending';
  }

  private getBookingDateValue(booking: DashboardBooking): number {
    const date = this.getBookingDateLabel(booking);
    const parsed = Date.parse(date);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private normalizeSpaces(response: any): DashboardSpace[] {
    const spaces = Array.isArray(response) ? response : response?.spaces || [];
    return spaces ?? [];
  }

  private normalizeBookings(response: any): DashboardBooking[] {
    const bookings = Array.isArray(response) ? response : response?.bookings || [];
    return bookings ?? [];
  }
}
