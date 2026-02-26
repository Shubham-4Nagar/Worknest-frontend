import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class SpaceService {

    private baseUrl = 'http://127.0.0.1:5000/spaces';
    private ownerBaseUrl  = 'http://127.0.0.1:5000/owner';

    constructor(private http: HttpClient){}

    //Method to attach JWT token for access 
    private getAuthHeaders():HttpHeaders{
        const token = localStorage.getItem('token');
        console.log("Token:", token); 

        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }
//PUBLIC ROUTES
// Get all public spaces
    getSpaces(): Observable<any> {
        return this.http.get(this.baseUrl);
    }

// Get specific space details
    getSpaceById(spaceId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/${spaceId}`);
    }

  // Get pricing (Public)
    getPricing(spaceId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/${spaceId}/pricing`);
    }

  // Get amenities (Public)
    getAmenities(spaceId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/${spaceId}/amenities`);
    }
// OWNER ROUTES
    // Create new space
  createSpace(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl,
      data,
      { headers: this.getAuthHeaders() }
    );
    }

  // Update space
  updateSpaces(spaceId: string, data: any): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/${spaceId}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete space
  deleteSpaces(spaceId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${spaceId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Add pricing
  addPricing(spaceId: string, data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${spaceId}/pricing`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete pricing
  deletePricing(pricingId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/pricing/${pricingId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Add amenities
  addAmenities(spaceId: string, data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${spaceId}/amenities`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get all spaces for logged-in owner
  getOwnerSpaces(): Observable<any> {
    return this.http.get(
      `${this.ownerBaseUrl}/spaces`,
      { headers: this.getAuthHeaders() }
    );
  }
}


