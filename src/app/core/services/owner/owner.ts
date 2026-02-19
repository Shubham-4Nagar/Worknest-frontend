import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OwnerDashboardResponse {
  total_spaces: number;
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_earning: number;
}

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = 'http://localhost:5000/owner';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<OwnerDashboardResponse> {
    return this.http.get<OwnerDashboardResponse>(
      `${this.apiUrl}/dashboard`
    );
  }

  getSpaces() {
    return this.http.get(`${this.apiUrl}/spaces`);
  }

  getBookings() {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  getEarnings() {
    return this.http.get(`${this.apiUrl}/earnings`);
  }
}
