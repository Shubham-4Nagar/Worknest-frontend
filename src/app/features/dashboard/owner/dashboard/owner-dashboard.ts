import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerService, OwnerDashboardResponse } from '../../../../core/services/owner/owner';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css'
})
export class OwnerDashboard implements OnInit {

  dashboardData?: OwnerDashboardResponse;
  loading = true;

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {
    this.ownerService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load error:', err);
        this.loading = false;
      }
    });
  }
}
