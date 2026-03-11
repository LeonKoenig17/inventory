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
  boxName: string = "";
  searchInput: string = "";
  foundItems: any[] = [];
  
  isInputOpen: boolean = false;
  isSearching: boolean = false;
  hasSearched: boolean = false;
  isSearchActive: boolean = false;

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

  async searchItem() {
    if (!this.searchInput.trim()) return;
    this.isSearchActive = true;
    this.isSearching = true;
    this.hasSearched = true;
    this.foundItems = [];
    this.foundItems = await this.apiService.searchItems(this.searchInput);
    this.foundItems.sort((a, b) => a.box_name.localeCompare(b.box_name));
    this.isSearching = false;
    this.cdr.detectChanges();
  }

  endSearch() {
    this.foundItems = [];
    this.searchInput = "";
    this.isSearchActive = false;
  }
}