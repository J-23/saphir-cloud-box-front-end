import { Component, OnInit, Inject } from '@angular/core';
import { UsersService } from 'app/main/apps/users/users.service';
import { AppUser } from 'app/main/models/app-user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group } from 'app/main/models/group.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {

  form: FormGroup;
  
  users: AppUser[] = [];

  dialogTitle: string;
  group: Group;

  constructor(private usersService: UsersService,
    public matDialogRef: MatDialogRef<GroupFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) { 
      
    this.dialogTitle = _data.dialogTitle;
    
    this.group = _data.group || {};
  }

  ngOnInit() {
    this.usersService.getUsers()
      .then(users => {
        this.users = users;
      })
      .catch();

    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      name: [ this.group.name, Validators.required ],
      users: [ this.group.users ]
    });
  }

  compare(user1: AppUser, user2: AppUser) {
    return user1 && user2 ? user1.id == user2.id : user1 == user2;
  }
}
