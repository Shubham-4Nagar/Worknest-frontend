import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tick } from "@angular/core/testing";

@Injectable({
    providedIn:'root'
})
export class AdminService {

    private baseUrl = 'http://127.0.0.1:5000/admin';

    constructor(private http:HttpClient){}

    //Dashboard 
    getDashboardstats(): Observable<any>{
        return this.http.get(`${this.baseUrl}/dashboard`); 
    }
    //Owner Request
    getPendingOwners():Observable<any>{
        return this.http.get(`${this.baseUrl}/owners/pending`);
    }
    //Verify Owner
    verifyOwner(ownerId:string, status:'approved'| 'rejected'): Observable<any>{
        return this.http.patch(
            `${this.baseUrl}/owners/${ownerId}/verify`,{status}
        );
    }

    //Users
    getAllUsers(): Observable<any>{
        return this.http.get(`${this.baseUrl}/users`);
    }
    //Bookings
    getAllBookings(): Observable<any>{
        return this.http.get(`${this.baseUrl}/bookings`);
    }
    //Pending-Spaces
    getPendingSpaces(): Observable<any>{
        return this.http.get(`${this.baseUrl}/spaces/pending`);
    }
    updateSpacseStatus(spaceId:string, status:'active'|'inactive'):Observable<any>{
        return this.http.patch(
            `${this.baseUrl}/spaces/${spaceId}/approval`, {status}
        );
    }
}