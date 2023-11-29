import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  // Event emitter to notify when an action is taken
  onEmitStatusChange = new EventEmitter();
  // Object to store dialog data
  details: any = {};
  isMouseOverButtonYes: boolean = false;
  isMouseOverButtonNo: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  // If dialog data is provided, assign it to the 'details' object
  ngOnInit(): void {
    if (this.dialogData) {
      this.details = this.dialogData;
    }
  }

  // Method to handle the action and emit an event
  handleChangeAction() {
    this.onEmitStatusChange.emit();
  }

  // Add methods to handle mouse events for "Yes" button
  handleMouseEnter() {
    this.isMouseOverButtonYes = true;
  }

  handleMouseLeave() {
    this.isMouseOverButtonYes = false;
  }

  // Add methods to handle mouse events for "No" button
  handleMouseEnterNo() {
    this.isMouseOverButtonNo = true;
  }

  handleMouseLeaveNo() {
    this.isMouseOverButtonNo = false;
  }
}