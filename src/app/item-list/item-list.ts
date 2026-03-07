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
    
  }
}