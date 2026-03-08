import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';

@Component({
  selector: 'app-item-list',
  imports: [FormsModule],
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.scss']
})
export class ItemList implements OnInit {

  selectedBox: any | null = null;
  boxes: any[] = [];
  boxId?: number;
  boxName: string = "";

  inventory: any[] = [];
  itemName: string = "";
  itemQuantity!: number;
  isInputOpen = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private apiService: Api
  ) {}

  ngOnInit() {
    this.boxId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBox();
    this.loadInventory();
  }

  async loadBox() {
    this.boxes = await this.apiService.loadBoxes();
    this.selectedBox = this.boxes.find(box => box.id == this.boxId);
    this.boxName = this.selectedBox.name;
    this.cdr.detectChanges();
  }

  async loadInventory() {
    if (this.boxId !== undefined) {
      this.inventory = await this.apiService.loadInventory(this.boxId);
      console.log(this.inventory);
      this.cdr.detectChanges();
    }
  }

  async addItem(event: Event) {
    event.stopPropagation();
    if (!this.itemName || !this.itemQuantity || !this.selectedBox) return;
    await this.apiService.addItem(
      this.selectedBox.id,
      this.itemName,
      this.itemQuantity
    );
    this.itemName = "";
    this.itemQuantity = 0;
    this.isInputOpen = false;
    this.cdr.detectChanges();
  }
  
  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: Event) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

}