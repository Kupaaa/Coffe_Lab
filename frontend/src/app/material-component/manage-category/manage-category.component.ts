import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/Services/category.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss'],
})
export class ManageCategoryComponent implements OnInit {
  // Define displayed columns for the MatTable
  displayedColumns: string[] = ['name', 'edit'];

  // Define class properties
  dataSource: any;
  responseMessage: any;

  // Constructor to inject necessary services
  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  // Initialization logic to be executed when the component is created
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  // Function to fetch and display table data
  tableData() {
    // Call the category service to get category data
    this.categoryService.getCategorys().subscribe(
      (response: any) => {
        this.ngxService.stop();

        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        this.ngxService.stop();
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

  // Function to apply filtering to the table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Placeholder function for handling "Add" action
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }

  // Function to handle "Edit" action
  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' product',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteCategory(values.id);
        dialogRef.close();
      }
    );
  }
  deleteCategory(id: any) {
    this.categoryService.delete(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.opensnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.ngxService.stop(); // Stop loading indicator on error
        console.log(error); // Log the error to the console

        if (error.error?.message) {
          this.responseMessage = error.error?.message; // Extract error message from the response
        } else {
          this.responseMessage = GlobalConstants.genericError; // Use a generic error message if no specific message is available
        }

        this.snackbarService.opensnackbar(
          this.responseMessage,
          GlobalConstants.error
        ); // Display an error message using the Snackbar service
      }
    );
  }
}
