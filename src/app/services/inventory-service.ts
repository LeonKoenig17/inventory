import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBoxes() {
    return this.http.get(`${this.apiUrl}/boxes`);
  }

  getItems() {
    return this.http.get(`${this.apiUrl}/items`);
  }

  addNewBox(name: string) {
    return this.http.post(`${this.apiUrl}/boxes`, { name });
  }

  addNewItem(name: string) {
    return this.http.post(`${this.apiUrl}/items`, { name });
  }

  getItemsInBox(name: string) {
    return this.http.get(`${this.apiUrl}/boxes/${encodeURIComponent(name)}/items`);
  }
}