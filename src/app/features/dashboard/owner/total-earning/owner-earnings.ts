import { Component, OnInit } from "@angular/core";
import { CommonModule} from "@angular/common";
import { BookingService } from "../../../../core/services/booking.service";
import { catchError, forkJoin, of } from "rxjs";

@Component({
    selector:'app-owner-earnings',
    standalone:true,
    imports: [CommonModule],
    templateUrl:'./owner-earnings.html',
    styleUrl:'./owner-earning.css'
})

export class OwnerEarnings implements OnInit{

    totalEarnings = 0;
    completedBookings = 0;
    pendingValue = 0;
    isLoading = true;

    constructor(private bookingService : BookingService){}

    ngOnInit() {
        this.loadEarnings();
    }

    loadEarnings(){
        forkJoin({
          earnings: this.bookingService.getOwnerEarnings().pipe(
            catchError(() => of({ total_earnings: 0 }))
          ),
          bookings: this.bookingService.getOwnerBookings().pipe(catchError(() => of([])))
        }).subscribe({
            next: ({ earnings, bookings }: any) => {
                const normalizedBookings = bookings?.bookings ?? bookings ?? [];
                this.totalEarnings = earnings.total_earnings;
                this.completedBookings = normalizedBookings.filter(
                  (booking: any) => booking.status === 'completed'
                ).length;
                this.pendingValue = normalizedBookings
                  .filter((booking: any) => booking.status === 'pending')
                  .reduce((sum: number, booking: any) => sum + Number(booking.total_amount || 0), 0);
                this.isLoading = false;
            },
            error : (err) => {
                console.log("Error Loading Earnings", err);
                this.isLoading=false;
            }
        });
    }
}
