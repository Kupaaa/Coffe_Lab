import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/Services/product.service'; // Import Product service
import { SnackbarService } from 'src/app/Services/snackbar.service'; // Import Snackbar service
import { GlobalConstants } from 'src/app/shared/global-constants'; // Import global constants
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product', // Component selector
  templateUrl: './manage-product.component.html', // HTML template
  styleUrls: ['./manage-product.component.scss'], // Component styles
})
export class ManageProductComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'categoryName',
    'description',
    'price',
    'edit',
  ]; // Define column names
  dataSource: any; // Data source for MatTable
  responseMessage: any; // Response message for error handling

  constructor(
    private productService: ProductService, // Inject Product service
    private ngxService: NgxUiLoaderService, // Inject NgxUiLoader service for loading indicators
    private dialog: MatDialog, // Inject MatDialog for dialogs (not used in this code)
    private snackbarService: SnackbarService, // Inject Snackbar service for displaying messages
    private router: Router // Inject Router for navigation (not used in this code)
  ) {}

  ngOnInit(): void {
    this.ngxService.start(); 
    this.tableData(); 
  }


  // This method is responsible for fetching and displaying product data in a table.
  tableData() {
    this.productService.getProduct().subscribe(
      (response: any) => {
        this.ngxService.stop(); 
        this.dataSource = new MatTableDataSource(response); 
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


  // Apply a filter to the data source based on user input
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); 
  }


  // This method is called when an "add" action is triggered for a new product
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }


  // This method is called when an edit action is triggered for a product
  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }

// This method is called when a delete action needs to be confirmed for a product.
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' product',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    );
  }

  // This method is called when a product needs to be deleted.
  deleteProduct(id: any) {
    this.productService.delete(id).subscribe(
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
        ); 
      }
    );
  }


  // This method is called when the status of a product is changed.
  onChange(status: any, id: any) {
    var data = {
      status: status.toString(),
      id: id,
    };
    this.productService.updateStatus(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
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
