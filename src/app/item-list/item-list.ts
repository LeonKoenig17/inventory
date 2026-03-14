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
  boxId: string = "";
  boxName: string | null = null;
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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error("No box ID in route");
      return;
    }
    this.boxId = id;
    this.loadBox();
  }
  
  async loadBox() {
    const data = await fetch(`${this.apiService.BASE_URL}/boxes/${this.boxId}.json`)
    .then(res => res.json());
    if (data.items) {
      this.inventory = Object.entries(data.items).map(([id, item]: any) => ({ ...item }));;
    }
    console.log("inventory: ", this.inventory);
    this.boxName = data.name;
    this.cdr.detectChanges();
    return data;
  }

  async addItem(event: Event) {
    event.stopPropagation();
    if (!this.itemName || !this.itemQuantity || !this.boxId) return;
    await this.apiService.addItem(
      this.boxId,
      this.itemName,
      this.itemQuantity
    );
    this.isInputOpen = false;
    this.itemName = "";
    this.itemQuantity = 0;
    this.loadBox();
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
    this.isRenamingBox = false;
    this.loadBox();
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
    this.goToMain();
  }
  
  goToMain() {
    this.router.navigate([""]);
  }
}