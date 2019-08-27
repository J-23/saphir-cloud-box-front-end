import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PermissionType } from 'app/main/models/file-storage.model';
import { UsersService } from 'app/main/apps/users/users.service';
import { AppUser } from 'app/main/models/app-user.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  
  users: AppUser[] = [];
  filtredEmails: Observable<string[]>;

  constructor(public matDialogRef: MatDialogRef<PermissionFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private usersService: UsersService) { 
    
    this.title = this._data.title;

    this.recipientEmail = this._data.recipientEmail;
    this.fileStorageId = this._data.fileStorageId;
    this.type = this._data.type || 0;

    this.usersService.getUsers()
      .then()
      .catch();
  }

  ngOnInit() {
    this.permissionForm = this.createForm();

    this.usersService.onUsersChanged
      .subscribe(users => {
        
        this.users = users;

        this.filtredEmails = this.permissionForm.controls['recipientEmail'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        )
      });
  }

  createForm(): FormGroup {

    if (this.recipientEmail) {
      return this._formBuilder.group({
        recipientEmail: [{value: this.recipientEmail, disabled: true}, [Validators.required, Validators.email]],
        fileStorageId    : [this.fileStorageId, Validators.required],
        type    : [this.type, Validators.required]
      });
    }

    return this._formBuilder.group({
      recipientEmail: [this.recipientEmail, [Validators.required, Validators.email]],
      fileStorageId    : [this.fileStorageId, Validators.required],
      type    : [this.type, Validators.required]
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(user => user.email.toLowerCase().indexOf(filterValue) === 0).map(user => user.email);
  }
}
