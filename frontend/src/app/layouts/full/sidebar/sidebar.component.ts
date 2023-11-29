import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import jwtDecode from 'jwt-decode';
import { MenuItems } from 'src/app/shared/menu-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [] // You can add component-specific styles here if needed
})
export class AppSidebarComponent implements OnDestroy {
  // Define class properties
  mobileQuery: MediaQueryList; // Media query object for responsiveness
  token: any = localStorage.getItem('token'); // Retrieve token from local storage
  tokenPayload: any; // Store decoded token data

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef, // Used for detecting changes in the component
    media: MediaMatcher, // Provides media query matching functionality
    public menuItems: MenuItems // MenuItems service or data source
  ) {
    // Decode the JWT token to access its data
    this.tokenPayload = jwtDecode(this.token);

    // Set up the mobile query for responsive design
    this.mobileQuery = media.matchMedia('(min-width: 768px)');

    // Define a listener to detect changes in the mobile query
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    // Add the listener to the mobile query
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  // Implement the ngOnDestroy lifecycle method to clean up resources
  ngOnDestroy(): void {
    // Remove the listener when the component is destroyed to prevent memory leaks
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}