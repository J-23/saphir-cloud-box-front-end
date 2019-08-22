import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PermissionType } from 'app/main/models/file-storage.model';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {

  title: string;
  permissionForm: FormGroup;

  recipientEmail: string;
  fileStorageId: number;
  type;
  
  constructor(public matDialogRef: MatDialogRef<PermissionFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) { 
    
    this.title = this._data.title;

    this.recipientEmail = this._data.recipientEmail;
    this.fileStorageId = this._data.fileStorageId;
    this.type = this._data.type || 0;
  }

  ngOnInit() {
    this.permissionForm = this.createForm();
  }

  createForm(): FormGroup {

    return this._formBuilder.group({
      recipientEmail: [this.recipientEmail, [Validators.required, Validators.email]],
      fileStorageId    : [this.fileStorageId, Validators.required],
      type    : [this.type, Validators.required]
    });
  }
}
