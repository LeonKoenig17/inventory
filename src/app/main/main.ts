import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InventoryService } from '../services/inventory-service';

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
      this.ngZone.run(async () => {
        this.boxes = await this.inventoryService.getBoxes();
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Error loading boxes:', err);
    }
  }

  async addBox(event: any) {
    if (this.boxName.trim() === "") return;
    event.stopPropagation();
    const newBox: Box = {
      id: Date.now(),
      name: this.boxName,
      items: []
    };

    try {
      await this.inventoryService.addBox(newBox);
      await this.loadBoxes();
      this.boxName = "";
      this.isInputOpen = false;
    } catch (err) {
      console.error('Error saving box:', err);
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