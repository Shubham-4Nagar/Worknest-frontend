import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})

export class RequestOwnerService{

    private baseUrl = 'http://127.0.0.1:5000/user';

    constructor(private http: HttpClient){}

    private getAuthHeaders(): HttpHeaders{
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }
    requestOwner(data: {id_proof: string}){
        return this.http.post(`${this.baseUrl}/request-owner`, data);
    }

    submitRequest(data: {id_proof: string}){

        return this.http.post(
            `${this.baseUrl}/request-owner`,
            data,{
                headers: this.getAuthHeaders()
            }
        );
    }
}
