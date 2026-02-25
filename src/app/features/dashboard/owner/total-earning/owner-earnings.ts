import { Component, OnInit } from "@angular/core";
import { CommonModule} from "@angular/common";
import { BookingService } from "../../../../core/services/booking.service";

@Component({
    selector:'app-owner-earnings',
    standalone:true,
    imports: [CommonModule],
    templateUrl:'./owner-earnings.html',
    styleUrl:'./owner-earning.css'
})

export class OwnerEarnings implements OnInit{

    totalEarnings = 0;
    isLoading = true;

    constructor(private bookingService : BookingService){}

    ngOnInit() {
        this.loadEarnings();
    }

    loadEarnings(){
        this.bookingService.getOwnerEarnings().subscribe({
            next: (res) => {
                this.totalEarnings = res.total_earnings;
                this.isLoading = false;
            },
            error : (err) => {
                console.log("Error Loading Earnings", err);
                this.isLoading=false;
            }
        });
    }
}