import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../services/inventory-service';

@Component({
  selector: 'app-item-list',
  imports: [],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList {
  constructor(private route: ActivatedRoute, 
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef) {}
  boxName: string = '';
  items: any[] = [];

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
}
