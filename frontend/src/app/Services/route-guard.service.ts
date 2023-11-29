import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwt_decode from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(
    public auth: AuthService, // Authentication service.
    public router: Router, // Router service for navigation.
    private snackbarService: SnackbarService // Service for displaying snackbar messages.
  ) {}

  // Method to determine if a user is allowed to access a route.
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole; // Get the expected user roles from route data.

    const token: any = localStorage.getItem('token');
    var tokenPaylod: any;
    try {
      tokenPaylod = jwt_decode(token); // Decode the JWT token to access user information.
    } catch (err) {
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let checkRole = false;

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPaylod.role) {
        checkRole = true;
      }
    }
    if (tokenPaylod.role == 'user' || tokenPaylod.role == 'admin') {
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }
      // Display a snackbar message for unauthorized access and navigate to a default route.
      this.snackbarService.opensnackbar(
        GlobalConstants.unauthorized,
        GlobalConstants.error
      );
      this.router.navigate(['/cafe/dashboard']);
      return false;
    } else {
      // Navigate to the home page, clear the local storage, and deny access.
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
