import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/Services/bill.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {displayedColumns: string[] = ['name','email','contactNumber','paymentMethod','total','view'];
dataSource:any;
responseMessage:any;

constructor(private billService: BillService,
  private ngxService: NgxUiLoaderService,
  private dialog: MatDialog,
  private snackbarService: SnackbarService,
  private router: Router ) { }

ngOnInit(): void {
  this.ngxService.start();
  this.tableData();
}

// Fetch and display bill data.
tableData(){
  this.billService.getBills().subscribe((response:any)=>{
    this.ngxService.stop();
    this.dataSource = new MatTableDataSource(response);
  },(error:any)=>{
    this.ngxService.stop();
    if(error.error?.manage){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
  })
}

// Filter the displayed data based on user input.
applyFilter(event:Event){
  const filtervalue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filtervalue.trim().toLowerCase();
}

// Open a dialog to view bill details.
handleViewAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    data:values
  };
  dialogConfig.width = "100%";
  const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
  this.router.events.subscribe(()=>{
    dialogRef.close();
  })
}

// Download a PDF report for a specific bill.
downloadReport(values:any){
  this.ngxService.start();
  var data = {
    name:values.name,
    email:values.email,
    uuid:values.uuid,
    contactnumber:values.contactNumber,
    paymentMethod:values.paymentMethod,
    totalAmount:values.total,
    productDetails:values.productDetails
  }
  this.billService.getPDF(data).subscribe(
    (response) => {
      saveAs(response, values.uuid + '.pdf');
      this.ngxService.stop();
    },
    (error) => {
      console.error('Error downloading PDF:', error);
      this.ngxService.stop();
      // Handle the error, e.g., show an error message to the user
    }
  );
 }  

// Handle the delete action for a bill.
handleDeleteAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data={
    message: 'delete' +values.name+' bill'
  };
  const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
  const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
    this.ngxService.start();
    this.deleteProduct(values.id);
    dialogRef.close();

  })
}

// Delete a specific bill.
deleteProduct(id:any){
  this.billService.delete(id).subscribe((response:any)=>{
    this.ngxService.stop();
    this.tableData();
    this.responseMessage = response?.message;
    this.snackbarService.opensnackbar(this.responseMessage,"success");
  },(error:any)=>{
    this.ngxService.stop();
    if(error.error?.manage){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
  })
  
}

}


