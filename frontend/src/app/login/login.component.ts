import { Component, OnInit } from '@angular/core'; // Component and OnInit decorators
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Form related modules
import { Router } from '@angular/router'; // Router for navigation
import { UserService } from '../Services/user.service'; // User service for authentication
import { SnackbarService } from '../Services/snackbar.service'; // Snackbar service for notifications
import { MatDialogRef } from '@angular/material/dialog'; // MatDialogRef for managing the dialog
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Loading indicator service
import { GlobalConstants } from '../shared/global-constants'; // Global constants for the application

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup; // Property to hold the login form
  responsemessage: any; // Property to store response messages

  // Constructor with dependency injection
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    // Initialize the login form with email and password form controls and validators
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      password: [null, [Validators.required]],
    });
  }

  // Method to handle the form submission
  handleSubmit() {
    this.ngxService.start(); 
    var formData = this.loginForm.value; 
    var data = {
      email: formData.email,
      password: formData.password,
    };

    // Make an HTTP request to the login service
    this.userService.login(data).subscribe(
      (response: any) => {
        this.ngxService.stop(); 
        this.dialogRef.close();
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/cafe/dashboard']); 
      },
      (error) => {
        this.ngxService.stop(); 
        if (error.error?.message) {
          this.responsemessage = error.error?.message; 
          
        }
        else{
          this.responsemessage = GlobalConstants.genericError; 
        }
        this.snackbarService.opensnackbar(
          this.responsemessage,
          GlobalConstants.error
        ); 
      }
    );
  }
}
