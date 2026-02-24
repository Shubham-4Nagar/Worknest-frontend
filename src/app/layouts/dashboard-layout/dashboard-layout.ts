import { Component } from '@angular/core';
import { RouterLink,RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

}
