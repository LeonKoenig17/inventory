import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InventoryService } from '../services/inventory-service';
import { renderURL } from '../../../environment';

export interface Item {
  id: number;
  name: string;
  quantity: number;
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
  styleUrls: ['./main.scss'],
})
export class Main implements OnInit {

  boxes: Box[] = [];
  isInputOpen: boolean = false;
  boxName: string = "";

  constructor(
    private inventoryService: InventoryService, 
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBoxes();
  }

  async loadBoxes() {
    try {
      await fetch(`${renderURL}/boxes`)
        .then(response => response.json())
        .then(boxes => this.boxes = boxes);
      console.log(this.boxes);
      this.cdr.detectChanges(); // Manually trigger change detection
    } catch (err) {
      console.error("Failed to load boxes:", err);
    }
  }

  async addBox(event: any) {
    if (this.boxName == "") return;
    event.stopPropagation();
    try {
      await fetch(`${renderURL}/boxes`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ name: this.boxName })
      }).then(response => console.log(response.json()))
    } catch (err) {
      console.error("Failed to add box:", err);
    }
  }

  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: any) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

  // ✅ Navigate to ItemList component with selected box ID
  goToBox(boxId: number) {
    this.router.navigate(['/box', boxId]); // make sure your route matches /box/:id
  }
}