import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/Services/category.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  // Define events to emit when adding or editing a category
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();

  // Create a FormGroup for the category form
  categoryForm: any = FormGroup;

  // Initialize variables for dialog actions, response messages, and dialog data
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;

  // Inject MAT_DIALOG_DATA to receive data from the parent component
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Initialize the category form and add validators
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    });

    // If the dialog action is 'Edit', prepopulate the form with category data
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  // Handle form submission
  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  // Add a new category
  add() {
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name,
    };

    // Call the category service to add a new category
    this.categoryService.add(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = response.message;
        this.snackbarService.opensnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.dialogRef.close();
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

  // Edit an existing category
  edit() {
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
    };

    // Call the category service to update an existing category
    this.categoryService.update(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = response.message;
        this.snackbarService.opensnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.dialogRef.close();
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
