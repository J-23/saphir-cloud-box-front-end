import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-folder-form',
  templateUrl: './folder-form.component.html',
  styleUrls: ['./folder-form.component.scss']
})
export class FolderFormComponent implements OnInit {

  private parentId: number;
  private name: string;

  form: FormGroup;

  constructor(public matDialogRef: MatDialogRef<FolderFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) { 
      this.parentId = this._data.parentId;
      this.name = this._data.name;
    }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {

    return this._formBuilder.group({
      parentId: [this.parentId, Validators.required],
      name    : [this.name, Validators.required]
    });
  }
}
