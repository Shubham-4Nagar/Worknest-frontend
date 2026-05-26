import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BookingService } from "../../../../core/services/booking.service";
import { finalize } from "rxjs";

interface Booking {
  booking_id: string;
  space_name: string;
  booking_date: string;
  status: string;
  start_date?: string;
  end_date?: string;
  total_amount?: number;
  booking_type?: string;
}

@Component({
  selector: "app-user-bookings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./user-bookings.html",
  styleUrl: "./user-bookings.css"
})
export class UserBookings implements OnInit {

  bookings: Booking[] = [];

  spaceId: string | null = null;
  bookingDate = "";

  isLoading = true;
  isCreating = false;
  isCancelling = false;
  message = "";
  minDate = new Date().toISOString().split("T")[0];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit() {

    // get spaceId from query params
    this.route.queryParams.subscribe(params => {
      this.spaceId = params["spaceId"] || null;
    });

    this.loadBookings();

  }

  loadBookings() {

    this.bookingService.getMyBookings().subscribe({

      next: (data: any) => {
        this.bookings = Array.isArray(data) ? data : data?.bookings || [];
        this.isLoading = false;
      },

      error: () => {
        this.isLoading = false;
      }

    });

  }

  createBooking() {

    if (!this.spaceId || !this.bookingDate) return;

    this.isCreating = true;

    this.bookingService.createBooking({

      space_id: this.spaceId,
      booking_date: this.bookingDate

    }).pipe(finalize(() => this.isCreating = false)).subscribe({

      next: () => {

        this.message = "Booking created successfully";

        this.bookingDate = "";
        this.spaceId = null;

        this.loadBookings();
      },

      error: () => {

        this.message = "Failed to create booking";
      }

    });

  }

  cancelBooking(bookingId: string) {
    this.isCancelling = true;
    this.message = '';

    this.bookingService.cancelBooking(bookingId)
      .pipe(finalize(() => this.isCancelling = false))
      .subscribe({
        next: () => {
          this.message = 'Booking cancelled successfully';
          this.loadBookings();
        },
        error: () => {
          this.message = 'Unable to cancel the booking right now';
        },
      });
  }

  getStatusCount(status: string): number {
    return this.bookings.filter((booking) => booking.status?.toLowerCase() === status).length;
  }

  getDisplayDate(booking: Booking): string {
    return booking.booking_date || booking.start_date || booking.end_date || 'Date pending';
  }

}
