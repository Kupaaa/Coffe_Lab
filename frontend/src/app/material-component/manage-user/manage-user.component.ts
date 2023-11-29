import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { UserService } from 'src/app/Services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  displayedColumns: string [] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;

  constructor(private ngxService:NgxUiLoaderService,
    private userService:UserService,
    private snackbarService:SnackbarService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData(); // Retrieve user data from the API
  }

  // Fetch and display user data
  tableData(){
    this.userService.getUsers().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
    })
  }

  // Apply filtering to the table
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Handle changes to user status
  handleChangeAction(status:any,id:any){
    this.ngxService.start();
    var data = {
      status:status.toString(),
      id:id
    }
    this.userService.update(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.opensnackbar(this.responseMessage,"Success");
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
    })
    
  }
  // Handle user deletion action
  handleDeleteUserAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' user',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteUser(values.id);
        dialogRef.close();
      }
    );
  }
    // Delete a user
  deleteUser(id: any) {
    this.userService.delete(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.opensnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.ngxService.stop(); 
        console.log(error);

        if (error.error?.message) {
          this.responseMessage = error.error?.message; 
        } else {
          this.responseMessage = GlobalConstants.genericError; 
        }

        this.snackbarService.opensnackbar(
          this.responseMessage,
          GlobalConstants.error
        ); 
      }
    );
  }
}


