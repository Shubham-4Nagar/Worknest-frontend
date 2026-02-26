import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BookingService } from "../../../../core/services/booking.service";

interface Booking {
  booking_id: string;
  space_name: string;
  booking_date: string;
  status: string;
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
  message = "";

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

      next: (data: Booking[]) => {
        this.bookings = data;
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

    }).subscribe({

      next: () => {

        this.message = "Booking created successfully";

        this.bookingDate = "";
        this.spaceId = null;

        this.loadBookings();

        this.isCreating = false;
      },

      error: () => {

        this.message = "Failed to create booking";
        this.isCreating = false;
      }

    });

  }

}