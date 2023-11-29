import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  opensnackbar(message: string, action: string) {
    // Check if the action is 'error'
    if (action === 'error') {
      // Open a snackbar with the provided message and custom settings
      this.snackbar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000, // Display duration in milliseconds
        panelClass: ['black-snackbar'], // Apply a CSS class to style the snackbar
      });
    } else {
      this.snackbar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000, // Display duration in milliseconds
        panelClass: ['green-snackbar'], // Apply a CSS class to style the snackbar
      });
    }
  }
}
