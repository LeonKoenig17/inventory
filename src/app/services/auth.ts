import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private role: 'admin' | 'guest' = 'guest'; // default guest

  loginAsAdmin(username: string, password: string) {
    // simple example: match hardcoded credentials
    if (username === 'admin' && password === 'AdminPassword123') {
      this.role = 'admin';
      return true;
    }
    return false;
  }

  loginAsGuest() {
    this.role = 'guest';
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
