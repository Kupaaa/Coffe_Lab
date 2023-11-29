import { Component, EventEmitter, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/Services/category.service';
import { ProductService } from 'src/app/Services/product.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product', // Component selector
  templateUrl: './product.component.html', // HTML template
  styleUrls: ['./product.component.scss'], // Component styles
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter(); // Event emitter for adding a product
  onEditProduct = new EventEmitter(); // Event emitter for editing a product
  productForm: any = FormGroup; // Form group for the product form
  dialogAction: any = 'Add'; // Action for the dialog (default: Add)
  action: any = 'Add'; // Action label (default: Add)
  responseMessage: any; // Response message for error handling
  categorys: any = []; // Array to store categories

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any, // Inject dialog data from the parent component
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Initialize the product form with validators
    this.productForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      categoryId: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
    });

    // If the dialog action is 'Edit', prepopulate the form with product data
    if (this.dialogData.action == 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }

  // Get categories from the CategoryService
  getCategorys() {
    this.categoryService.getCategorys().subscribe(
      (response: any) => {
        this.categorys = response;
      },
      (error: any) => {
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

  // Handle form submission
  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  // Add a new product
  add() {
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };

    // Call the product service to add a new product
    this.productService.add(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.opensnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
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

  // Edit an existing product
  edit() {
    var formData = this.productForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };

    // Call the product service to update an existing product
    this.productService.update(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.opensnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
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
