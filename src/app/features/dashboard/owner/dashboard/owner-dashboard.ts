import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { SpaceService } from "../../../../core/services/space.service";
import { RouterLink } from "@angular/router";
import { BookingService, OwnerBooking } from "../../../../core/services/booking.service";
import { catchError, forkJoin, of, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe, NgClass, DatePipe],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css'
})
export class OwnerDashboard implements OnInit, OnDestroy {

  spaces: any[]        = [];
  bookings: OwnerBooking[] = [];
  totalEarnings        = 0;
  isLoading            = true;

  private destroy$ = new Subject<void>();

  constructor(
    private spaceService: SpaceService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.loadOverview();
    localStorage.removeItem('ownerApproved');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get pendingBookingsCount()   { return this.bookings.filter(b => b.status === 'pending').length; }
  get confirmedBookingsCount() { return this.bookings.filter(b => b.status === 'confirmed').length; }
  get completedBookingsCount() { return this.bookings.filter(b => b.status === 'completed').length; }

  get totalCapacity(): number {
    return this.spaces.reduce((sum, s) => sum + Number(s.max_capacity || 0), 0);
  }

  get recentBookings(): OwnerBooking[] {
    return [...this.bookings]
      .sort((a, b) => Date.parse(b.start_date || '') - Date.parse(a.start_date || ''))
      .slice(0, 4);
  }

  loadOverview() {
    forkJoin({
      spaces:   this.spaceService.getOwnerSpaces().pipe(catchError(() => of({ spaces: [] }))),
      bookings: this.bookingService.getOwnerBookings().pipe(catchError(() => of({ bookings: [] }))),
      earnings: this.bookingService.getOwnerEarnings().pipe(catchError(() => of({ total_earnings: 0 }))),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ spaces, bookings, earnings }: any) => {
        this.spaces        = spaces?.spaces  ?? spaces  ?? [];
        this.bookings      = bookings?.bookings ?? bookings ?? [];
        this.totalEarnings = earnings?.total_earnings ?? 0;
        this.isLoading     = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  deleteSpace(spaceId: string) {
    if (!confirm('Are you sure you want to delete this space?')) return;
    this.spaceService.deleteSpaces(spaceId).subscribe({
      next:  () => { this.spaces = this.spaces.filter(s => s.space_id !== spaceId); },
      error: (err) => { console.error('Delete failed:', err); alert('Could not delete space. Please try again.'); }
    });
  }

  getSpaceStatus(space: any): string {
    if (space?.is_active === false) return 'inactive';
    return (space?.status || 'active').toLowerCase();
  }

  formatSpaceType(type: string): string {
    if (!type) return 'Workspace';
    return type.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
}
