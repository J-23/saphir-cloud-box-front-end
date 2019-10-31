import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PermissionInfo } from 'app/main/models/file-storage.model';
import { UsersService } from 'app/main/apps/users/users.service';
import { AppUser } from 'app/main/models/app-user.model';
import { ClientsService } from 'app/main/apps/clients/clients.service';
import { Client } from 'app/main/models/client.model';
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

  permissionInfo: PermissionInfo;
  fileStorageId: number;
  type;
  
  users: AppUser[] = [];
  clients: Client[] = [];
  groups: Group[] = [];

  allUsers: AppUser = new AppUser();
  allClients: Client = new Client();
  allGroups: Group = new Group();

  constructor(public matDialogRef: MatDialogRef<PermissionFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private usersService: UsersService,
    private clientsService: ClientsService,
    private groupsService: GroupsService) { 
    
    this.title = this._data.title;

    this.permissionInfo = this._data.permissionInfo;
    this.fileStorageId = this._data.fileStorageId;
    this.type = this._data.type || 0;
    this.currentUserId = this._data.currentUserId;

    this.allUsers.id = -1;
    this.allClients.id = -2;
    this.allGroups.id = -3;
  }

  ngOnInit() {

    this.permissionForm = this.createForm();

    this.clientsService.getClients().then(clients => this.clients = clients).catch();
      
    this.groupsService.getGroups().then(groups => this.groups = groups.map(group => new Group(group))).catch();
      
    this.usersService.getUsers().then(users => this.users = users.filter(user => user.id != this.currentUserId)).catch();
  }

  createForm(): FormGroup {

    var objects = [];

    if (this.permissionInfo) {

      this.permissionInfo.recipients.forEach(us => {
        objects.push(new AppUser(us));
      });

      this.permissionInfo.clients.forEach(cl => {
        objects.push(new Client(cl));
      });

      this.permissionInfo.groups.forEach(gr => {
        objects.push(new Group(gr));
      });
    }

    return this._formBuilder.group({
      objects: [objects],
      fileStorageId    : [this.fileStorageId, Validators.required],
      type    : [this.type, Validators.required],
      userIds: [this.permissionInfo ? this.permissionInfo.recipients.map(rec => rec.id) : []],
      clientIds: [this.permissionInfo ? this.permissionInfo.clients.map(cl => cl.id) : []],
      groupIds: [this.permissionInfo ? this.permissionInfo.groups.map(gr => gr.id) : []]
    });
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
