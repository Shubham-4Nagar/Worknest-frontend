import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BookingService } from "../../../../core/services/booking.service";
import { finalize, Subject, takeUntil } from "rxjs";

interface Booking {
  booking_id: string;
  space_name: string;
  booking_type: string;
  start_date?: string;
  end_date?: string;
  total_amount?: number;
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
export class UserBookings implements OnInit, OnDestroy {

  bookings: Booking[] = [];
  spaceId: string | null = null;
  bookingDate = "";

  isLoading = true;
  isCreating = false;
  cancellingId: string | null = null;
  message = "";
  messageType: "success" | "error" = "success";
  minDate = new Date().toISOString().split("T")[0];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.spaceId = params["spaceId"] || null;
    });
    this.loadBookings();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getMyBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (data: any) => {
        this.bookings = Array.isArray(data) ? data : (data?.bookings ?? []);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showMessage("Could not load bookings. Please try again.", "error");
      }
    });
  }

  createBooking() {
    if (!this.spaceId || !this.bookingDate) return;

    this.isCreating = true;
    this.message = "";

    // Send the full payload the backend expects
    const payload: any = {
      space_id: this.spaceId,
      booking_date: this.bookingDate,   // backend now accepts this shorthand
      number_of_people: 1
    };

    this.bookingService.createBooking(payload)
      .pipe(finalize(() => this.isCreating = false))
      .subscribe({
        next: () => {
          this.showMessage("Booking created! Waiting for owner approval.", "success");
          this.bookingDate = "";
          this.spaceId = null;
          this.loadBookings();
        },
        error: (err) => {
          const msg = err?.error?.error || err?.error?.message || "Failed to create booking";
          this.showMessage(msg, "error");
        }
      });
  }

  cancelBooking(bookingId: string) {
    this.cancellingId = bookingId;
    this.message = "";

    this.bookingService.cancelBooking(bookingId)
      .pipe(finalize(() => this.cancellingId = null))
      .subscribe({
        next: () => {
          this.showMessage("Booking cancelled successfully.", "success");
          this.loadBookings();
        },
        error: (err) => {
          const msg = err?.error?.error || "Unable to cancel the booking right now.";
          this.showMessage(msg, "error");
        }
      });
  }

  getStatusCount(status: string): number {
    return this.bookings.filter(b => b.status?.toLowerCase() === status).length;
  }

  getDisplayDate(booking: Booking): string {
    if (booking.start_date) {
      try {
        const d = new Date(booking.start_date);
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      } catch {
        return booking.start_date;
      }
    }
    return "Date pending";
  }

  private showMessage(msg: string, type: "success" | "error") {
    this.message = msg;
    this.messageType = type;
  }
}
