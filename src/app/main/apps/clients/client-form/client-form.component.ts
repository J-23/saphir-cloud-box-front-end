import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  object: any;
  form: FormGroup;
  dialogTitle: string;
  
  constructor(public matDialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) { 
    
    this.dialogTitle = _data.dialogTitle;
    
    if (_data.object) {
      this.object = _data.object;
    }
    else {
      this.object = {};
    }
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {

    if (this.object) {
      return this._formBuilder.group({
        id      : [this.object.id],
        name    : [this.object.name, Validators.required]
      });
    }
    
    return this._formBuilder.group({
      id      : [],
      name    : [null, Validators.required]
    });
  }
}
