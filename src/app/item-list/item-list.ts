import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../services/inventory-service';
import { Box, Item } from '../main/main';

@Component({
  selector: 'app-item-list',
  imports: [FormsModule],
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.scss']
})
export class ItemList implements OnInit {

  selectedBox: Box | null = null;
  items: Item[] = [];
  boxName: string = "";
  itemName: string = "";
  itemQuantity!: number;
  isInputOpen = false;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    const boxId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(boxId)) {
      await this.loadBox(boxId);
    }
  }

  // Load the selected box and its items
  async loadBox(boxId: number) {
    try {
      const box = await this.inventoryService.getBoxById(boxId);
      if (box) {
        // Run inside NgZone to ensure Angular change detection works correctly
        this.ngZone.run(() => {
          this.selectedBox = box;
          this.items = box.items || [];
          this.boxName = box.name;
          this.cdr.detectChanges();
        });
      } else {
        console.warn(`Box not found: ${boxId}`);
      }
    } catch (error) {
      console.error("Error loading box: ", error);
    }
  }

  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: Event) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

  // Add a new item to the box
  async addItem(event: Event) {
    event.stopPropagation();
    if (!this.itemName || !this.itemQuantity) return;

    const newItem: Item = {
      id: Date.now(),
      name: this.itemName,
      quantity: this.itemQuantity
    };

    this.items.push(newItem);

    if (this.selectedBox) {
      this.selectedBox.items = this.items;
      try {
        await this.inventoryService.updateBox(this.selectedBox);
      } catch (err) {
        console.error("Error updating box:", err);
      }
    }

    this.itemName = '';
    this.itemQuantity = 0;
    this.isInputOpen = false;

    this.ngZone.run(() => {
      this.cdr.detectChanges(); // fix ExpressionChangedAfterItHasBeenCheckedError
    });
  }
}