import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { UserService } from 'src/app/Services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = FormGroup; // Define the form group
  responseMessage: any; // Holds response messages

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Initialize the changePasswordForm with form controls and validators
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  // Function to validate if the new password and confirm password match
  validateSubmit() {
    if (
      this.changePasswordForm.controls['newPassword'].value !==
      this.changePasswordForm.controls['confirmPassword'].value
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Function to handle the form submission to change the password
  handleChangePasswordSubmit() {
    this.ngxService.start(); 
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };
    // Call the user service to change the password
    this.userService.changePassword(data).subscribe(
      (response: any) => {
        this.ngxService.stop(); 
        this.responseMessage = response?.message;
        this.dialogRef.close(); 
        this.snackbarService.opensnackbar(this.responseMessage, 'success'); 
      },
      (error) => {
        console.log(error);
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.messages;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.opensnackbar(
          this.responseMessage,
          GlobalConstants.error
        ); // Show an error snackbar
      }
    );
  }
}
