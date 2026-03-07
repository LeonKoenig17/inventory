import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = 'https://inventory-kid6.onrender.com';

  constructor(private http: HttpClient) {}

  getUsers(){
    return this.http.get(`${this.apiUrl}/users`);
  }
}
