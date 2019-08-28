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

  allUsers: AppUser = new AppUser();
  allClients: Client = new Client();

  constructor(public matDialogRef: MatDialogRef<PermissionFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private usersService: UsersService,
    private clientsService: ClientsService) { 
    
    this.title = this._data.title;

    this.permissions = this._data.permissions;
    this.fileStorageId = this._data.fileStorageId;
    this.type = this._data.type || 0;
    this.currentUserId = this._data.currentUserId;

    this.allUsers.id = -1;
    this.allClients.id = -2;
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

            this.setClients(recipients);
          })
          .catch();
      })
      .catch();

    

  }

  createForm(): FormGroup {

    return this._formBuilder.group({
      objects: new FormControl(),
      fileStorageId    : [this.fileStorageId, Validators.required],
      type    : [this.type, Validators.required]
    });
  }

  setUsers(recipients: AppUser[]) {

    var result: any[] = [];

    if (recipients.length == this.users.length) {
      result.push(this.allUsers);
    }
    else {
      recipients.forEach(recip => {
        result.push(recip)
      });
    }

    this.permissionForm.patchValue({
      objects: result
    });
  }

  setClients(recipients: AppUser[]) {
    var clients = this.permissions.map(perm => perm.recipient.client);
    clients = this.getUniqueClients(clients);

    if (clients.length == this.clients.length && recipients.length == this.users.length) {
      clients = [];
      clients.push(this.allClients);

      this.permissionForm.patchValue({
        objects: clients
      });
    }
    else {
      if (recipients.filter(recip => clients.map(cl => cl.id).includes(recip.client.id)).length ==
        this.users.filter(recip => clients.map(cl => cl.id).includes(recip.client.id)).length) {
        var values: any[] = this.permissionForm.controls['objects'].value;
      
        clients.forEach(client => {
          values.push(client);
        });

        this.permissionForm.patchValue({
          objects: values
        });
      }
    }
    
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
    return object1 && object2 ? object1.id == object2.id : object1 == object2;
  }


  sendForm() {

    var result: any[] = [];

    var values: any[] = this.permissionForm.controls['objects'].value;

    var client = values.find(value => value instanceof Client && value.id == this.allClients.id);

    if (client) {
      this.clients.forEach(client => {
        result.push(client);
      });
    }
    else {
      var clients = values.filter(value => value instanceof Client);
      clients.forEach(client => {
        result.push(client);
      });
    }

    var user = values.find(value => value instanceof AppUser && value.id== this.allUsers.id);

    if (user) {
      this.users.forEach(user => {
        result.push(user);
      });
    }
    else {
      var users = values.filter(value => value instanceof AppUser);
      users.forEach(user => {
        result.push(user);
      });
    }

    this.permissionForm.patchValue({
      objects: result
    });

    this.matDialogRef.close(this.permissionForm);
  }
}
