import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings implements OnInit {

  bookings: any[] = [];
  isLoading = true;
  selectedStatus = 'All';
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllBookings().subscribe({
      next: (response: any) => {
        this.bookings = response?.bookings ?? response ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get filteredBookings(): any[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.bookings.filter((booking) => {
      const status = (booking.status || '').toLowerCase();
      const space = (booking.space_name || '').toLowerCase();
      const user = (booking.user_name || booking.user_id || '').toLowerCase();
      const matchesStatus = this.selectedStatus === 'All' || status === this.selectedStatus.toLowerCase();
      const matchesSearch = !term || space.includes(term) || user.includes(term);

      return matchesStatus && matchesSearch;
    });
  }

  getStatusCount(status: string): number {
    return this.bookings.filter((booking) => (booking.status || '').toLowerCase() === status).length;
  }

  getTotalRevenue(): number {
    return this.filteredBookings.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0);
  }

  getDisplayDate(booking: any): string {
    return booking.booking_date || booking.start_date || booking.created_at || '';
  }

}
