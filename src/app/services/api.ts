import { ChangeDetectorRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  renderURL = "https://inventory-kid6.onrender.com";
  boxes: any[] = [];


  async loadBoxes() {
    try {
      const boxes = await fetch(`${this.renderURL}/boxes`)
      .then(response => response.json())
      return boxes;
    } catch (err) {
      console.error("Failed to load boxes:", err);
    }
  }
  
  async addBox(boxName: string) {
    try {
      await fetch(`${this.renderURL}/boxes`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ name: boxName })
      });
    } catch (err) {
      console.error("Failed to add box:", err);
    }
  }

  async loadInventory(boxId: number) {
    try {
      const inventory = await fetch(`${this.renderURL}/box_inventory?box_id=${boxId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })
      .then(response => response.json())
      return inventory;
    } catch (err) {
      console.error("Failed to add box:", err);
    }
  }
}
