import { Component } from '@angular/core';
import { RouterLink,RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

  role='';

  constructor(private authService: AuthService,
              private router: Router){
    
    this.role = this.authService.getRole() || '';
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
