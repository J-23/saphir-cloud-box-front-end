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
  title: string;
  private fileName: string;

  form: FormGroup;

  constructor(public matDialogRef: MatDialogRef<FileFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) { 
    this.parentId = this._data.parentId;
    this.title = this._data.title;
    this.fileName = this._data.name;
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {

    if (this.fileName) {
      return new FormGroup({
        parentId: new FormControl(this.parentId, Validators.required),
        content: new FormControl({value: null, disabled: true}),
        size: new FormControl({value: null, disabled: true}),
        name: new FormControl(this.fileName, Validators.required)
      });
    }
    
    return new FormGroup({
      parentId: new FormControl(this.parentId, Validators.required),
      content: new FormControl({value: null, disabled: true}, Validators.required),
      size: new FormControl({value: null, disabled: true}, Validators.required),
      name: new FormControl(this.fileName, Validators.required)
    });
  }

  onFileChange(event) {
    var selectedFile = event.target.files[0];
    
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const base64 = reader.result.toString().split(',')[1];
      this.form.patchValue({
        content: base64,
        size: selectedFile.size,
        name: selectedFile.name
      });
    };
  }
}
