import { Injectable } from '@angular/core';
import { Box } from '../main/main';

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private STORAGE_KEY = "boxes";

  getBoxes() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveBoxes(boxes: any[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(boxes));
  }
}