import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {

  private parentId: number;

  form: FormGroup;

  constructor(public matDialogRef: MatDialogRef<FileFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) { 
    this.parentId = this._data.parentId;
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {

    return new FormGroup({
      parentId: new FormControl(this.parentId, Validators.required),
      content: new FormControl({value: null, disabled: true}, Validators.required)
    })
  }

  onFileChange(event) {
    var selectedFile = event.target.files[0];
    
    this.form.patchValue({
      content: selectedFile
    });
  }
}
