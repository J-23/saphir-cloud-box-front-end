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

    this.usersService.getUsers()
      .then(users => {
        this.users = users.filter(user => user.id != this.currentUserId);

        var recipients = this.permissions.map(perm => perm.recipient);
        this.setUsers(recipients);
        
        this.clientsService.getClients()
          .then(clients => {
            this.clients = clients;

            this.setClients();
          })
          .catch();
          
        this.groupsService.getGroups()
          .then(groups => {
            groups.forEach(group => {
              this.groups.push(group);
            });

            this.setGroups();
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

  setUsers(recipients: AppUser[]) {

    if (recipients.length == this.users.length) {
      this.selectedUsers.push(this.allUsers);
    }
    else {
      recipients.forEach(recip => {
        this.selectedUsers.push(recip)
      });
    }

    this.permissionForm.patchValue({
      'objects': this.selectedUsers
    });
  }

  setClients() {
    var clients = this.permissions.map(perm => perm.recipient.client);
    clients = this.getUniqueClients(clients);

    var values: any[] = this.permissionForm.controls['objects'].value;

    if (clients.length == this.clients.length && this.selectedUsers.length == this.users.length) {
      this.selectedClients.push(this.allClients);
      
      values.push(this.allClients);
    }
    else {

      if (this.selectedUsers.find(user => user.id == this.allUsers.id)) {
      
        clients.forEach(client => {
          this.selectedClients.push(client);
          values.push(client);
        });
      }
    }

    this.permissionForm.patchValue({
      'objects': values
    });
  }

  setGroups() {

    var allUserIds = [];

    this.groups.forEach(group => {

      var userIds = group.users.map(user => user.id);
      var users = this.selectedUsers.filter(user => userIds.includes(user.id));

      if (userIds.length == users.length || this.selectedUsers.find(us => us.id == this.allUsers.id)) {
        this.selectedGroups.push(group);
      }

      userIds.forEach(id => allUserIds.push(id));
    });

    if (this.selectedGroups.length == this.groups.length) {
      this.selectedGroups = [];
      this.selectedGroups.push(this.allGroups);
    }

    var values: any[] = this.permissionForm.controls['objects'].value;

    this.selectedGroups.forEach(group => {
      values.push(group);
    });

    this.permissionForm.patchValue({
      'objects': values
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

  compare(object1: any, object2: any) {
    var result = false;

    if (object1 && object2) {
      if (object1 instanceof AppUser) {
        result = object1.userName && object2.userName && object1.id == object2.id;
      }
      else if (object1 instanceof Client) {
        result = object1.createDate && object2.createDate && object1.id == object2.id;
      }
      else {
        result = object1.users && object2.users && object1.users.length == object2.users.length && object1.id == object2.id;
      }
    }
    return result
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

    var group = values.find(value => !(value instanceof Client || value instanceof AppUser) && value.id == this.allGroups.id);

    if (group) {
      this.permissionForm.patchValue({
        'groupIds': this.groups.map(group => group.id)
      });
    }
    else {
      var groups = values.filter(value => !(value instanceof Client || value instanceof AppUser));
      this.permissionForm.patchValue({
        'groupIds': groups.map(group => group.id)
      });
    }

    this.matDialogRef.close(this.permissionForm);
  }
}
