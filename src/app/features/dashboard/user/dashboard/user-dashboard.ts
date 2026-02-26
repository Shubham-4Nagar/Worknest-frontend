import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {

  firstName = '';
  role = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {

    const role = this.authService.getRole();
    this.role = role || '';

    // optional later when /me endpoint connected
    const userId = localStorage.getItem('user_id');

  }

}