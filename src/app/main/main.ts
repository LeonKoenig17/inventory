import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InventoryService } from '../services/inventory-service';

export interface Item {
  id: number;
  name: string;
}

export interface Box {
  id: number;
  name: string;
  items: Item[];
}

@Component({
  selector: 'app-main',
  imports: [FormsModule, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

  constructor(private inventoryService: InventoryService) {}

  boxes: any[] = [];
  isInputOpen: boolean = false;
  boxName: string = "";

  ngOnInit() {
    this.boxes = this.inventoryService.getBoxes();
  }

  addBox(event: any) {
    if (this.boxName.trim() === "") return;
    event.stopPropagation();
    const newBox: Box = {
      id: Date.now(),
      name: this.boxName,
      items: []
    };
    this.boxes.push(newBox);
    this.inventoryService.saveBoxes(this.boxes);
    this.boxName = "";
    this.isInputOpen = false;
  }

  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: any) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

  loadBoxes() {
    this.boxes = JSON.parse(localStorage.getItem('boxes') || '[]');
  }
}
