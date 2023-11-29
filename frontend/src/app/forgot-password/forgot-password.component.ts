import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../Services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPaswordForm: any = FormGroup;
  responsemessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private diaglogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Create the form group for the "Forgot Password" form.
    this.forgotPaswordForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
    });
  }

  // Function to handle the form submission.
  handleSubmit() {
    this.ngxService.start();
    var formData = this.forgotPaswordForm.value;
    var data = {
      email: formData.email,
    };
    this.userservice.forgotPassword(data).subscribe(
      (Response: any) => {
        this.ngxService.stop();
        this.responsemessage = Response?.message;
        this.diaglogRef.close();
        this.snackbarService.opensnackbar(this.responsemessage, '');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responsemessage.error.error?.message;
        } else {
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
