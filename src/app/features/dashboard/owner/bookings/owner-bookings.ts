import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { BookingService, OwnerBooking } 
  from '../../../../core/services/booking.service';

@Component({
  selector: 'app-owner-bookings',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './owner-bookings.html',
  styleUrl: './owner-booking.css'
})
export class OwnerBookings implements OnInit {

  bookings: OwnerBooking[] = [];
  filteredBookings: OwnerBooking[] = [];

  activeStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed' = 'pending';

  isLoading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getOwnerBookings().subscribe({
      next: (res: any) => {

        // If backend returns { bookings: [...] }
        this.bookings = res.bookings ?? res;

        this.filterBookings();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading bookings', err);
        this.isLoading = false;
      }
    });
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter(
      b => b.status === this.activeStatus
    );
  }

  changeStatus(status: any) {
    this.activeStatus = status;
    this.filterBookings();
  }

  updateStatus(
    bookingId: string,
    status: 'confirmed' | 'cancelled'
  ) {
    this.bookingService
      .updateBookingStatus(bookingId, status)
      .subscribe({
        next: () => {

          // Update locally
          const booking = this.bookings.find(
            b => b.booking_id === bookingId
          );

          if (booking) {
            booking.status = status;
          }

          this.filterBookings();
        },
        error: (err) => {
          console.error('Failed to update booking', err);
        }
      });
  }

  getCount(status: string) {
    return this.bookings.filter(
      b => b.status === status
    ).length;
  }
}