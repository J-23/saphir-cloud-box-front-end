import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-form',
  templateUrl: './confirm-form.component.html',
  styleUrls: ['./confirm-form.component.scss']
})
export class ConfirmFormComponent implements OnInit {

  public confirmMessage: string;

  constructor(public dialogRef: MatDialogRef<ConfirmFormComponent>) { }

  ngOnInit() {
  }

}
