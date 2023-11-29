import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service'; // Importing a custom user service.

// Define the HomeComponent class, which implements the OnInit interface.
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

// Constructor for the HomeComponent class.
export class HomeComponent implements OnInit {
  constructor(
    private dialog: MatDialog, // MatDialog service for displaying dialogs.
    private router: Router, // Router service for navigation.
    private userservice: UserService
  ) {} // Custom UserService for user-related functionality.

  ngOnInit(): void {
    if (localStorage.getItem('Token') != null)
      [
        this.userservice.checkToken().subscribe(
          (response: any) => {
            this.router.navigate(['/cafe/dashboard']);
          },
          (error: any) => {
            console.log(error);
          }
        ),
      ];
  }

  // Function to handle the "Sign Up" action.
  signupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(SignupComponent, dialogConfig); // Open the SignupComponent in a dialog using the configured settings.
  }

  // Function to handle the "Forgot Password" action.
  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent, dialogConfig); // Open the ForgotPasswordComponent in a dialog using the configured settings.
  }

  loginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(LoginComponent, dialogConfig); // Open the ForgotPasswordComponent in a dialog using the configured settings.
  }
}
