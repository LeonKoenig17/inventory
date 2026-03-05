import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../services/inventory-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  imports: [FormsModule],
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.scss']
})
export class ItemList {

  boxes: any[] = [];
  items: any[] = [];
  boxId!: number;
  boxName: string = "";
  itemName: string = "";
  itemQuantity!: number;
  isInputOpen = false;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.boxId = Number(this.route.snapshot.paramMap.get('id'));
    this.boxes = this.inventoryService.getBoxes();
    const box = this.boxes.find(b => b.id === this.boxId);
    if (box) {
      this.boxName = box.name;
      this.items = box.items;
    }
  }

  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: Event) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

  addItem(event: Event) {
    event.stopPropagation();
    if (!this.itemName || !this.itemQuantity) return;
    const newItem = {
      item_name: this.itemName,
      quantity: this.itemQuantity
    };
    this.items.push(newItem);
    const box = this.boxes.find(b => b.id === this.boxId);
    box.items = this.items;
    this.inventoryService.saveBoxes(this.boxes);
    this.itemName = "";
    this.itemQuantity = 0;
    this.isInputOpen = false;
  }
}