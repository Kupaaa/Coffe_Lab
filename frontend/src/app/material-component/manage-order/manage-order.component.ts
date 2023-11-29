import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/Services/bill.service';
import { CategoryService } from 'src/app/Services/category.service';
import { ProductService } from 'src/app/Services/product.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
    'edit',
  ];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    // Initialize the manageOrderForm using FormBuilder
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

// Function to fetch category data
getCategorys() {
  this.categoryService.getCategorys().subscribe(
    (response: any) => {
      this.ngxService.stop();
      this.categorys = response;
    },
    (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;  
      }
      this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
    });
}

// Function to fetch product data by category
getProductByCategory(value: any) {
  this.productService.getproductsByCategory(value.id).subscribe(
    (response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue('');
    },
    (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;  
      }
      this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
    });
}

// Function to fetch product details
getProductDetails(value: any) {
  this.productService.getById(value.id).subscribe(
    (response: any) => {
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price * 1);
    },
    (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;  
      }
      this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
    });
}

// Function to set quantity and calculate total
setQuantity(value: any) {
  var temp = this.manageOrderForm.controls['quantity'].value;
  if (temp > 0) {
    this.manageOrderForm.controls['total'].setValue(
      temp * this.manageOrderForm.controls['price'].value
    );
  } else if (temp !='') {
    this.manageOrderForm.controls['quantity'].setValue('1');
    this.manageOrderForm.controls['total'].setValue(
      this.manageOrderForm.controls['quantity'].value *
      this.manageOrderForm.controls['price'].value
    );
  }
}

// Function to validate product addition
validateProductAdd() {
  if (
    this.manageOrderForm.controls['total'].value === 0 ||
    this.manageOrderForm.controls['total'].value === null ||
    this.manageOrderForm.controls['quantity'].value <= 0
  )
    return true;
  else return false;
}

// Function to validate form submission
validateSubmit() {
  if (
    this.totalAmount === 0 ||
    this.manageOrderForm.controls['name'].value === null ||
    this.manageOrderForm.controls['email'].value === null ||
    this.manageOrderForm.controls['contactNumber'].value === null ||
    this.manageOrderForm.controls['paymentMethod'].value === null ||
    !this.manageOrderForm.controls['contactNumber'].valid ||
    !this.manageOrderForm.controls['email'].valid
  ) {
    return true;
  } else {
    return false;
  }
}

// Function to add a product to the order
add() {
  var formData = this.manageOrderForm.value;
  var productName = this.dataSource.find(
    (e: { id: number; }) => e.id == formData.product.id
    
  );

  if (productName === undefined) {
    this.totalAmount = this.totalAmount + formData.total;
    console.log ("addproduct",this.dataSource)
    this.dataSource.push({
      id: formData.product.id,
      name: formData.product.name,
      category: formData.category.name,
      quantity: formData.quantity,
      price: formData.price,
      total: formData.total,
    });
    this.dataSource = [...this.dataSource];
    this.snackbarService.opensnackbar(
      GlobalConstants.productAdded,
      'Success'
    );
  } else {
    this.snackbarService.opensnackbar(
      GlobalConstants.productExistError,
      GlobalConstants.error
    );
  }
}

// Function to handle the deletion of a product from the order
handleDeleteAction(value: any, element: any) {
  this.totalAmount = this.totalAmount - element.total;
  this.dataSource.splice(value, 1);
  this.dataSource = [...this.dataSource];
}

// Function to handle the submission of the order
submitAction() {
  // console.log("Submit action started");
  this.ngxService.start();
  var formData = this.manageOrderForm.value;
  var data = {
    name: formData.name,
    email: formData.email,
    contactNumber: formData.contactNumber,
    paymentMethod: formData.paymentMethod,
    totalAmount: this.totalAmount,
    productDetails: JSON.stringify(this.dataSource),
  };
  // console.log("Data to be sent:", data);
  this.billService.generateReport(data).subscribe(
    (response: any) => {
      this.downloadFile(response?.uuid);  
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    },
    (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;  
      }
      this.snackbarService.opensnackbar(this.responseMessage,GlobalConstants.error);
    });
}

// Function to download a file
downloadFile(fileName: any) {
  var data = {
    uuid: fileName,
  }

  this.billService.getPDF(data).subscribe((response: any) => {
    saveAs(response, fileName + '.pdf');
    this.ngxService.stop();
  });
  // console.log('Data to be sent:', data);
}
}