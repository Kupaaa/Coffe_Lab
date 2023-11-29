import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  role: any;
  constructor(private router: Router,
    private dialog: MatDialog) {

  }
  // Method for user logout
  logout(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
      message: 'Logout'
    };
    // Subscribe to the 'onEmitStatusChange' event in the confirmation dialog
    const dialogRef =this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user)=>{
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }

   // Method to open the change password dialog
  changePassword(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ChangePasswordComponent,dialogConfig)
  }

}
