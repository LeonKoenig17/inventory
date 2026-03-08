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
      const response = await fetch(
        `${this.renderURL}/box_inventory?box_id=${boxId}`
      );
    
      const data = await response.json();
    
      if (!response.ok) {
        console.error("API error:", data);
        return [];
      }
    
      return data;
    
    } catch (err) {
      console.error("Failed to load inventory:", err);
      return [];
    }
  }

  async addItem(boxId: number, itemName: string, quantity: number) {
    try {
      const response = await fetch(`${this.renderURL}/box_inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          box_id: boxId,
          item_name: itemName,
          quantity: quantity
        })
      });

      return await response.json();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  }

  async deleteBox(boxId: number) {
    try {
      await fetch(`${this.renderURL}/boxes/${boxId}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to delete box:", err);
    }
  }
}
