import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private isAdminUser = false;
  login(username: string, password: string): boolean {
    const ADMIN_USERNAME = 'Beslim17';
    const ADMIN_PASSWORD = 'fireanbesa17';
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      this.isAdminUser = true;
      return true;
    }
    this.isAdminUser = false;
    return false;
  }

  logout() {
    this.isAdminUser = false;
  }

  isAdmin(): boolean {
    return this.isAdminUser;
  }
}
