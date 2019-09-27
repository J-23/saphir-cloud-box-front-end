import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientsService } from 'app/main/apps/clients/clients.service';
import { DepartmentsService } from 'app/main/apps/departments/departments.service';
import { UsersService } from 'app/main/apps/users/users.service';
import { GroupsService } from 'app/main/user-menu/groups/groups.service';
import { Client } from 'app/main/models/client.model';
import { Department } from 'app/main/models/department.model';
import { AppUser } from 'app/main/models/app-user.model';
import { Group } from 'app/main/models/group.model';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AdvancedSearchComponent implements OnInit {

  advancedSearchForm: FormGroup;
  
  clients: Client[] = [];
  departments: Department[] = [];
  users: AppUser[] = [];
  userGroups: Group[] = [];

  displayedColumns = ['icon', 'name', 'extension', 'updateDate', 'updateBy', 'size', 'button'];

  dataSource;
  
  constructor(private _formBuilder: FormBuilder,
    private clientsService: ClientsService,
    private departmentsService: DepartmentsService,
    private usersService: UsersService,
    private userGroupsService: GroupsService) { }

  ngOnInit() {

    this.advancedSearchForm = this.createForm();

    this.getClients();
    this.getDepartments();
    this.getUsers();
    this.getGroups();
  }

  createForm(): FormGroup { 
    return this._formBuilder.group({
      clients: [],
      departments: [],
      users: [],
      userGroups: [],
      startDate: [],
      endDate: [],
      searchString: []
    });
  }

  getClients() {
    this.clientsService.getClients()
      .then(clients => {
        this.clients = clients;
      })
      .catch();
  }

  getDepartments() {
    this.departmentsService.getDepartments()
      .then(departments => {
        this.departments = departments;
      })
      .catch();
  }

  getUsers() {
    this.usersService.getUsers()
      .then(users => {
        this.users = users;
      })
      .catch();
  }

  getGroups() {
    this.userGroupsService.getGroups()
      .then(groups => {
        this.userGroups = groups;
      })
  }

  search() {
    console.log(this.advancedSearchForm.value)
  }
}
