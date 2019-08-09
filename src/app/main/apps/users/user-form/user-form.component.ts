import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientsService } from '../../clients/clients.service';
import { Client } from 'app/main/models/client.model';
import { DepartmentsService } from '../../departments/departments.service';
import { Department } from 'app/main/models/department.model';
import { Role } from 'app/main/models/role.model';
import { RolesService } from '../../roles/roles.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  object: any;
  form: FormGroup;
  dialogTitle: string;
  
  clients: Client[] = [];
  departments: Department[] = [];
  roles: Role[] = [];

  constructor(public matDialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private clientsService: ClientsService,
    private departmentsService: DepartmentsService,
    private rolesService: RolesService) { 
    
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

    this.getClients();

    if (this.object) {
      this.getDepartmentsByClientId();
    }
    
    this.getRoles();
  }

  getClients() {
    this.clientsService.getClients()
      .then(clients => {
        this.clients = clients;
      })
      .catch();
  }

  getRoles() {
    this.rolesService.getRoles()
    .then(roles => {
      this.roles = roles;
    })
    .catch();
  }

  getDepartmentsByClientId() {
    if (this.form.controls['client'].valid && this.form.controls['client'].value) {
      this.departmentsService.getDepartmentsByClientId(this.form.controls['client'].value.id)
        .then(departments => {
          this.departments = departments;
        })
        .catch();
    }
  }

  createForm(): FormGroup {

    if (this.object) {
      return new FormGroup({
        id        : new FormControl(this.object.id),
        userName  : new FormControl(this.object.userName, Validators.required),
        email     : new FormControl(this.object.email, [Validators.required, Validators.email]),
        client    : new FormControl(this.object.client, Validators.required),
        department: new FormControl(this.object.department),
        role      : new FormControl(this.object.role, Validators.required)
      });

      
    }
    
    return new FormGroup({
      id        : new FormControl(),
      userName  : new FormControl(null, Validators.required),
      email     : new FormControl(null, [Validators.required, Validators.email]),
      client    : new FormControl(null, Validators.required),
      department: new FormControl(),
      role      : new FormControl(null, Validators.required)
    });
  }

  clientCompare(client1: Client, client2: Client) {
    return client1 && client2 && client1.id == client2.id;
  }

  departmentCompare(department1: Department, department2: Department) {
    return department1 && department2 && department1.id == department2.id;
  }

  roleCompare(role1: Role, role2: Role) {
    return role1 && role2 && role1.id == role2.id;
  }
}
