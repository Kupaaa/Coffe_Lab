import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken() {
    throw new Error('Method not implemented.');
  }
  constructor(private router: Router) { }

  // Method to check if a user is authenticated.
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // console.log(token);

    if (!token) {
      this.router.navigate(['/']);
      return false;
    } 
    else {
      return true;
    }
  }
}
