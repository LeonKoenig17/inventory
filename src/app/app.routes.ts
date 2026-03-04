import { Routes } from '@angular/router';
import { Main } from './main/main';
import { ItemList } from './item-list/item-list';

export const routes: Routes = [
    {path: "", component: Main},
    {path: "item-list/:box", component: ItemList},
];
