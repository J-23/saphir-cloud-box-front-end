import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PermissionType, Permission } from 'app/main/models/file-storage.model';
import { UsersService } from 'app/main/apps/users/users.service';
import { AppUser } from 'app/main/models/app-user.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ClientsService } from 'app/main/apps/clients/clients.service';
import { Client } from 'app/main/models/client.model';
import { controlNameBinding } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { AuthenticationService } from 'app/main/authentication/authentication.service';
import { GroupsService } from 'app/main/user-menu/groups/groups.service';
import { Group } from 'app/main/models/group.model';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {

  currentUserId: number;
  title: string;
  permissionForm: FormGroup;

  permissions: Permission[] = [];
  fileStorageId: number;
  type;
  
  users: AppUser[] = [];
  clients: Client[] = [];
  groups: Group[] = [];

  allUsers: AppUser = new AppUser();
  allClients: Client = new Client();
  allGroups: Group = new Group();

  selectedUsers: AppUser[] = [];
  selectedClients: Client[] = [];
  selectedGroups: Group[] = [];

  constructor(public matDialogRef: MatDialogRef<PermissionFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private usersService: UsersService,
    private clientsService: ClientsService,
    private groupsService: GroupsService) { 
    
    this.title = this._data.title;

    this.permissions = this._data.permissions;
    this.fileStorageId = this._data.fileStorageId;
    this.type = this._data.type || 0;
    this.currentUserId = this._data.currentUserId;

    this.allUsers.id = -1;
    this.allClients.id = -2;
    this.allGroups.id = -3;
  }

  ngOnInit() {

    this.permissionForm = this.createForm();

    this.clientsService.getClients()
      .then(clients => {
        this.clients = clients;
            
        this.groupsService.getGroups()
          .then(groups => {
            this.groups = groups.map(group => new Group(group));
            
            this.usersService.getUsers()
              .then(users => {

                this.users = users.filter(user => user.id != this.currentUserId);
                this.setSelected();
              })
              .catch();
          })
          .catch();
      })
      .catch();
  }

  createForm(): FormGroup {

    return this._formBuilder.group({
      objects: new FormControl(),
      fileStorageId    : [this.fileStorageId, Validators.required],
      type    : [this.type, Validators.required],
      userIds: [],
      clientIds: [],
      groupIds: []
    });
  }

  setSelected() {

    var result = [];

    var selectedUsers = this.permissions.map(perm => perm.recipient);
    selectedUsers = this.getUniqueUsers(selectedUsers);

    if (selectedUsers.length == this.users.length && selectedUsers.length > 1) {
      result.push(this.allUsers);
    }
    else {
      selectedUsers.forEach(user => {
        result.push(new AppUser(user));
      });
    }

    var selectedClients = selectedUsers.map(user => user.client);
    selectedClients = this.getUniqueClients(selectedClients);

    if (selectedClients.length == this.clients.length && selectedClients.length > 1) {
      result.push(this.allClients);
    }
    else {
      selectedClients.forEach(client => {
        result.push(new Client(client));
      });
    }

    var selectedGroups: Group[] = [];

    this.groups.forEach(group => {

      var isSelected = selectedUsers.length > 0 ? true : false;

      for (var selectedUser of selectedUsers) {
        if (!group.users.find(user => user.id == selectedUser.id)) {
          isSelected = false;
        }

        if (!isSelected) {
          break;
        }
      }

      if (isSelected) {
        selectedGroups.push(group);
      }
    });

    if (selectedGroups.length == this.groups.length && selectedGroups.length > 1) {
      result.push(this.allGroups);
    }
    else {
      selectedGroups.forEach(group => {
        result.push(new Group(group));
      });
    }

    this.permissionForm.patchValue({
      'objects': result
    });
  }

  getUniqueClients(clients: Client[]): Client[] {
    let result: Client[] = [];

    for (var client of clients) {
      if (!result.find(cl => cl.id == client.id)) {
        result.push(client);
      }
    }

    return result;
  }

  getUniqueUsers(users: AppUser[]) : AppUser[] {
    let result: AppUser[] = [];

    for (var user of users) {
      if (!result.find(cl => cl.id == user.id)) {
        result.push(user);
      }
    }

    return result;
  }

  compare(object1: any, object2: any) {
    var result = false;

    
    if (object1 instanceof AppUser && object2 instanceof AppUser) {
      result = object1 && object2 ? object1.id == object2.id : object1 == object2;
    }
    else if (object1 instanceof Client && object2 instanceof Client) {
      result = object1 && object2 ? object1.id == object2.id : object1 == object2;
    }
    else if (object1 instanceof Group && object2 instanceof Group) {
      result = object1 && object2 ? object1.id == object2.id : object1 == object2;
    }

    return result;
  }

  sendForm() {
    var values: any[] = this.permissionForm.controls['objects'].value;

    var client = values.find(value => value instanceof Client && value.id == this.allClients.id);

    if (client) {
      this.permissionForm.patchValue({
        'clientIds': this.clients.map(client => client.id)
      });
    }
    else {
      var clients = values.filter(value => value instanceof Client);
      this.permissionForm.patchValue({
        'clientIds': clients.map(client => client.id)
      });
    }

    var user = values.find(value => value instanceof AppUser && value.id== this.allUsers.id);

    if (user) {
      this.permissionForm.patchValue({
        'userIds': this.users.map(user => user.id)
      });
    }
    else {
      var users = values.filter(value => value instanceof AppUser);
      this.permissionForm.patchValue({
        'userIds': users.map(user => user.id)
      });
    }

    var group = values.find(value => value instanceof Group && value.id == this.allGroups.id);

    if (group) {
      this.permissionForm.patchValue({
        'groupIds': this.groups.map(group => group.id)
      });
    }
    else {
      var groups = values.filter(value => value instanceof Group);
      this.permissionForm.patchValue({
        'groupIds': groups.map(group => group.id)
      });
    }

    this.matDialogRef.close(this.permissionForm);
  }
}
