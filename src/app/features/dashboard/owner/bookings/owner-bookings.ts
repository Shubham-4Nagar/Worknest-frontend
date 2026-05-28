import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { BookingService, OwnerBooking } from '../../../../core/services/booking.service';
import { Subject, takeUntil } from 'rxjs';

type StatusTab = 'pending' | 'confirmed' | 'cancelled' | 'completed';

@Component({
  selector: 'app-owner-bookings',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './owner-bookings.html',
  styleUrl: './owner-booking.css'
})
export class OwnerBookings implements OnInit, OnDestroy {

  bookings: OwnerBooking[]         = [];
  filteredBookings: OwnerBooking[] = [];
  activeStatus: StatusTab          = 'pending';
  tabs: StatusTab[] = [
    'pending',
    'confirmed',
    'cancelled',
    'completed'
  ]
  isLoading   = true;
  updatingId: string | null        = null;

  private destroy$ = new Subject<void>();

  constructor(private bookingService: BookingService) {}

  ngOnInit() { this.loadBookings(); }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getOwnerBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (res: any) => {
        this.bookings = res?.bookings ?? (Array.isArray(res) ? res : []);
        this.filterBookings();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter(b => b.status === this.activeStatus);
  }

  changeStatus(status: StatusTab) {
    this.activeStatus = status;
    this.filterBookings();
  }

  updateStatus(bookingId: string, status: 'confirmed' | 'cancelled') {
    this.updatingId = bookingId;
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: () => {
        const booking = this.bookings.find(b => b.booking_id === bookingId);
        if (booking) booking.status = status;
        this.filterBookings();
        this.updatingId = null;
      },
      error: (err) => {
        console.error('Failed to update booking', err);
        this.updatingId = null;
      }
    });
  }

  getCount(status: string) {
    return this.bookings.filter(b => b.status === status).length;
  }
}
