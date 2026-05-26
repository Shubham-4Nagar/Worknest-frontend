import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe} from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{

  stats: any;
  pendingOwners: any[] = [];
  pendingSpaces: any[] = [];
  users: any[] = [];
  bookings: any[] = [];
  isLoading = true;

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.loadDashboard();
  }
  loadDashboard(){
    forkJoin({
      stats: this.adminService.getDashboardstats().pipe(catchError(() => of({}))),
      pendingOwners: this.adminService.getPendingOwners().pipe(catchError(() => of({ pending_owners: [] }))),
      pendingSpaces: this.adminService.getPendingSpaces().pipe(catchError(() => of({ pending_spaces: [] }))),
      users: this.adminService.getAllUsers().pipe(catchError(() => of({ users: [] }))),
      bookings: this.adminService.getAllBookings().pipe(catchError(() => of({ bookings: [] }))),
    }).subscribe({
      next:({ stats, pendingOwners, pendingSpaces, users, bookings }) => {
        this.stats = stats || {};
        this.pendingOwners = pendingOwners?.pending_owners ?? pendingOwners ?? [];
        this.pendingSpaces = pendingSpaces?.pending_spaces ?? pendingSpaces ?? [];
        this.users = users?.users ?? users ?? [];
        this.bookings = bookings?.bookings ?? bookings ?? [];
        this.isLoading = false;
      },
      error:(err)=> {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  get approvalBacklog(): number {
    return this.pendingOwners.length + this.pendingSpaces.length;
  }

  get pendingBookings(): number {
    return this.bookings.filter((booking: any) => booking.status === 'pending').length;
  }

  get activeUsers(): number {
    return this.users.filter((user: any) => user.role === 'User').length || this.stats?.total_users || 0;
  }
}
