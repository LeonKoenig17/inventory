import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  BASE_URL="https://inventory-1df2e-default-rtdb.europe-west1.firebasedatabase.app/";
  boxes: any[] = [];

  async loadBoxes() {
    try {
      const res = await fetch(`${this.BASE_URL}/boxes.json`);
      const data = await res.json();
      if (!data) return [];
      return Object.entries(data).map(([id, box]: any) => ({ id, ...box }));
    } catch (err) {
      console.error("Failed to load boxes:", err);
      return [];
    }
  }
  
  async addBox(boxName: string) {
    try {
      await fetch(`${this.BASE_URL}/boxes.json`, {
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

  async renameBox(boxId: string, name: string) {
    const response = await fetch(`${this.BASE_URL}/boxes/${boxId}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name})
    });
    return await response.json();
  }

  async deleteBox(boxId: string) {
    try {
      await fetch(`${this.BASE_URL}/boxes/${boxId}.json`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to delete box:", err);
    }
  }

  async loadInventory(boxId: string) {
    try {
      const data = await fetch(`${this.BASE_URL}/boxes/${boxId}/items.json`)
      .then(res => res.json());
      if (!data) return [];
      return Object.entries(data).map(([id, item]: any) => ({ id, ...item }));
    } catch (err) {
      console.error("Failed to load inventory:", err);
      return [];
    }
  }

  async addItem(boxId: string, itemName: string, quantity: number) {
    try {
      const response = await fetch(`${this.BASE_URL}/boxes/${boxId}/items.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: itemName,
          quantity: quantity
        })
      });

      return await response.json();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  }

  async deleteItems(itemIds: number[]) {
    const response = await fetch(`${this.BASE_URL}/items.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ itemIds })
    });

    return await response.json();
  }

  async searchItems(searchInput: string) {
    const response = await fetch(
      `${this.BASE_URL}/search-items?query=${searchInput}`
    ).then(response => response.json());
    return response;
  }
}
