import { Component, OnInit } from "@angular/core";
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { SpaceService } from "../../../../core/services/space.service";
import { RouterLink } from "@angular/router";
import { BookingService, OwnerBooking } from "../../../../core/services/booking.service";
import { catchError, forkJoin, of } from "rxjs";

@Component({
    selector: 'app-owner-dashboard',
    standalone: true,
    imports: [NgIf, NgFor, RouterLink, CurrencyPipe, NgClass, DatePipe],
    templateUrl: './owner-dashboard.html',
    styleUrl: './owner-dashboard.css'
})
export class OwnerDashboard implements OnInit {

    spaces: any[] = [];
    bookings: OwnerBooking[] = [];
    totalEarnings = 0;
    isLoading = true;

    constructor(
      private spaceService : SpaceService,
      private bookingService: BookingService
    ){}

    ngOnInit(){
        this.loadOverview();
        if(localStorage.getItem('ownerApproved')){
            localStorage.removeItem('ownerApproved');
        }
    }

    get pendingBookingsCount(): number {
      return this.bookings.filter((booking) => booking.status === 'pending').length;
    }

    get confirmedBookingsCount(): number {
      return this.bookings.filter((booking) => booking.status === 'confirmed').length;
    }

    get completedBookingsCount(): number {
      return this.bookings.filter((booking) => booking.status === 'completed').length;
    }

    get totalCapacity(): number {
      return this.spaces.reduce((sum, space) => sum + Number(space.max_capacity || 0), 0);
    }

    get recentBookings(): OwnerBooking[] {
      return [...this.bookings]
        .sort((a, b) => Date.parse(b.start_date || '') - Date.parse(a.start_date || ''))
        .slice(0, 4);
    }

    loadOverview(){
        forkJoin({
          spaces: this.spaceService.getOwnerSpaces().pipe(catchError(() => of({ spaces: [] }))),
          bookings: this.bookingService.getOwnerBookings().pipe(catchError(() => of([]))),
          earnings: this.bookingService.getOwnerEarnings().pipe(
            catchError(() => of({ total_earnings: 0 }))
          ),
        }).subscribe({
            next:({ spaces, bookings, earnings }: any)=> {
                this.spaces = spaces?.spaces ?? spaces ?? [];
                this.bookings = Array.isArray(bookings) ? bookings : bookings?.bookings ?? [];
                this.totalEarnings = earnings?.total_earnings ?? 0;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    deleteSpace(spaceId: string){
        const confirmed = confirm("Are you sure you want to delete this space ?");

        if(!confirmed) return;

        this.spaceService.deleteSpaces(spaceId).subscribe({
            next: ()=> {
                this.spaces = this.spaces.filter(
                    space => space.space_id !== spaceId
                );
            },
            error(err) {
                console.log("Delete failed:", err);
            }
        });
    }

    getSpaceStatus(space: any): string {
      return (space?.status || 'active').toLowerCase();
    }

    formatSpaceType(type: string): string {
      return type
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
}
