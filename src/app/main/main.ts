import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-main',
  imports: [FormsModule, RouterLink],
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
})
export class Main implements OnInit {

  boxes: any[] = [];
  isInputOpen: boolean = false;
  boxName: string = "";
  searchInput: string = "";

  constructor(
    private apiService: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBoxes();
  }
  
  async loadBoxes() {
    this.boxes = await this.apiService.loadBoxes();
    this.cdr.detectChanges();
  }

  async addBox(event: any) {
    if (this.boxName == "") return;
    event.stopPropagation();
    await this.apiService.addBox(this.boxName);
    this.boxName = "";
    this.isInputOpen = false;
    this.loadBoxes();
  }

  openInput() {
    this.isInputOpen = true;
  }

  closeInput(event: any) {
    event.stopPropagation();
    this.isInputOpen = false;
  }

  searchItem() {
    if (this.searchInput == "") return;
    this.apiService.searchItems(this.searchInput);
  }
}