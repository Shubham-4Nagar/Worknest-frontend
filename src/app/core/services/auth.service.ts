import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginResponse {
  message: string;
  user_id: string;
  role: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:5000/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  getCurrentUser (){
    return this.http.get<any>(`${this.baseUrl}/me`);
  }

  setUser(user:any){
    this.currentUserSubject.next(user);
  }

  clearStorage() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  saveAuthData(res: LoginResponse) {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('user_id', res.user_id);
  }

  getRole() {
    return localStorage.getItem('role');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.clearStorage();
  }
}