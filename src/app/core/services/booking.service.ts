import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OwnerBooking {
  booking_id: string;
  space_id: string;
  space_name: string;
  user_id: string;
  user_name: string;
  booking_type: string;
  start_date: string;
  end_date: string;
  number_of_people: number;
  total_amount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingBaseUrl = 'http://127.0.0.1:5000/bookings';
  private ownerBaseUrl = 'http://127.0.0.1:5000/owner';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // USER ROUTES

  createBooking(data: any): Observable<any> {
    return this.http.post(
      `${this.bookingBaseUrl}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  getMyBookings(): Observable<any> {
    return this.http.get(
      `${this.bookingBaseUrl}/me`,
      { headers: this.getAuthHeaders() }
    );
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.patch(
      `${this.bookingBaseUrl}/${bookingId}/cancel`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
  //OWNER ROUTES

  getOwnerBookings(): Observable<OwnerBooking[]> {
    return this.http.get<OwnerBooking[]>(
      `http://127.0.0.1:5000/owner/bookings`,
      {headers: this.getAuthHeaders()}
    )
  }
  updateBookingStatus(
    bookingId: string,
    status: 'confirmed' | 'cancelled'
  ): Observable<any> {
    return this.http.patch(
      `${this.ownerBaseUrl}/owner/${bookingId}`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }
  getOwnerEarnings() :Observable<{ total_earnings: number}> {
    return this.http.get<{ total_earnings: number} > (
      `http://127.0.0.1:5000/owner/earnings`,
      {headers: this.getAuthHeaders()}
    );
  }
}