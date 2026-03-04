import { ChangeDetectorRef, Component } from '@angular/core';
import { InventoryService } from '../services/inventory-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  constructor(private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  boxes: any[] = [];
  isInputOpen: boolean = false;
  boxName: string = "";

  ngOnInit() {
    this.loadBoxes();
  }

  addBox(event: any) {
    if (this.boxName.trim() === "") return;
    event.stopPropagation();
    this.inventoryService.addNewBox(this.boxName).subscribe(() => {
      this.boxName = "";
      this.isInputOpen = false;
      this.loadBoxes();
    });
  }

  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: any) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

  loadBoxes() {
    this.inventoryService.getBoxes().subscribe(data => {
      this.boxes = data as any[];
      this.cdr.detectChanges();
    });
  }

  openBox(boxName: string) {
    this.router.navigate(['/item-list', boxName]);
  }
}
