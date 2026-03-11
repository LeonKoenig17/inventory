import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { Auth } from '../services/auth';

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
  newBoxName: string = "";
  inventory: any[] = [];
  itemName: string = "";
  itemQuantity!: number;

  isInputOpen = false;
  isRenamingBox = false;
  isDeletingBox = false;
  isDeleteBoxChecked = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private apiService: Api,
    private router: Router,
    public auth: Auth
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
    this.loadInventory();
    this.cdr.detectChanges();
  }
  
  openItemInput() {
    this.isInputOpen = true;
  }

  closeItemInput(event: Event) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

  async confirmRenameInput() {
    if (this.newBoxName == "" || this.boxId == undefined) return;
    await this.apiService.renameBox(this.boxId, this.newBoxName)
    this.newBoxName = "";
    this.loadBox();
    this.isRenamingBox = false;
  }

  openRenameInput() {
    this.isRenamingBox = true;
  }

  cancelRenameInput() {
    this.isRenamingBox = false;
  }

  openDeleteDialog() {
    this.isDeletingBox = true;
  }

  closeDeleteDialog() {
    this.isDeletingBox = false;
  }

  checkDeleteBox() {
    this.isDeleteBoxChecked = !this.isDeleteBoxChecked;
  }

  async confirmDeleteBox() {
    if (!this.isDeleteBoxChecked || this.boxId == undefined) return;
    await this.apiService.deleteBox(this.boxId);
    this.isDeletingBox = false;
    this.router.navigate([""]);
  }
  
  goToMain() {
    this.router.navigate([""]);
  }
}