import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../services/inventory-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  imports: [FormsModule],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList {
  constructor(private route: ActivatedRoute, 
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef) {}
  boxName: string = '';
  items: any[] = [];
  isInputOpen: boolean = false;
  itemName: string = '';
  itemQuantity: number = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.boxName = params['box'];
      this.inventoryService.getItemsInBox(this.boxName).subscribe(data => {
        this.items = data as any[];
        this.cdr.detectChanges();
        console.log(this.items);
      });
    });
  }

  addItem(event: any) {
    if (this.itemName.trim() === "" || this.itemQuantity <= 0) return;
    event.stopPropagation();
    console.log('Adding item:', this.itemName, 'Quantity:', this.itemQuantity);
    this.itemName = '';
    this.itemQuantity = 0;
    this.isInputOpen = false;
  }

  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: any) {
    event.stopPropagation();
    this.isInputOpen = false;
  }
}
