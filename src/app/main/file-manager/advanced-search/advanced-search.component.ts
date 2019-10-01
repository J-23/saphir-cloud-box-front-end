import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
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
import { AdvancedSearchService } from './advanced-search.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort } from '@angular/material';
import { FuseUtils } from '@fuse/utils';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {

  advancedSearchForm: FormGroup;
  
  clients: Client[] = [];
  departments: Department[] = [];
  users: AppUser[] = [];
  userGroups: Group[] = [];

  displayedColumns = ['icon', 'name', 'extension', 'updateDate', 'updateBy', 'size', 'button'];

  dataSource: FilesDataSource | null;
  
  private _unsubscribeAll: Subject<any>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private _formBuilder: FormBuilder,
    private clientsService: ClientsService,
    private departmentsService: DepartmentsService,
    private usersService: UsersService,
    private userGroupsService: GroupsService,
    private advancedSearchService: AdvancedSearchService) { 
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this.advancedSearchForm = this.createForm();

    this.getClients();
    this.getDepartments();
    this.getUsers();
    this.getGroups();

    this.dataSource = new FilesDataSource(this.advancedSearchService, this.paginator, this.sort);
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
    
    var value = this.advancedSearchForm.value;

    var search = {
      ClientIds: value.clients ? value.clients.map(client => client.id) : [],
      DepartmentIds: value.departments ? value.departments.map(department => department.id) : [],
      UserIds: value.users ? value.users.map(user => user.id) : [],
      UserGroupIds: value.userGroups ? value.userGroups.map(group => group.id) : [],
      StartDate: value.startDate,
      EndDate: value.endDate,
      SearchString: value.searchString
    };

    this.advancedSearchService.search(search)
      .then()
      .catch();
  }

  ngOnDestroy(): void {
        
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

export class FilesDataSource extends DataSource<any> {

  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(private advancedSearchService: AdvancedSearchService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort) {
    super();
    this.filteredData = this.advancedSearchService.storages;
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.advancedSearchService.onStoragesChange,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges)
    .pipe(map(() => {
      let data = this.advancedSearchService.storages.slice();
      data = this.filterData(data);
      this.filteredData = [...data];
      data = this.sortData(data);

      const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
      return data.splice(startIndex, this._matPaginator.pageSize);
    }
    ));
  }

  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filterData(data): any {
    
    if (!this.filter) {
      return data;
    }
    
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[] {
    if (!this._matSort.active || this._matSort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch ( this._matSort.active ) {
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'createDate':
          [propertyA, propertyB] = [a.createDate, b.createDate];
          break;
        case 'updateDate':
          [propertyA, propertyB] = [a.updateDate, b.updateDate];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect(): void {
  }
}