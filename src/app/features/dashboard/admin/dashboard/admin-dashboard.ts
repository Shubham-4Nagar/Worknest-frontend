import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe} from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{

  stats: any;
  isLoading = true;

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.loadDashboard();
  }
  loadDashboard(){
    this.adminService.getDashboardstats().subscribe({
      next:(res) => {
        this.stats = res;
        this.isLoading = false;
      },
      error:(err)=> {
        console.log(err);
        this.isLoading = false;
      }
    });
  }
}
