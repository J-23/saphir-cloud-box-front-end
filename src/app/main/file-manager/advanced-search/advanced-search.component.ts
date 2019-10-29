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
import { FileManagerService } from '../file-manager.service';
import { Storage } from 'app/main/models/file-storage.model';
import { Router } from '@angular/router';

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
  folders: Storage[] = [];

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
    private foldersService: FileManagerService,
    private advancedSearchService: AdvancedSearchService,
    private fileManagerService: FileManagerService,
    private router: Router) { 
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this.advancedSearchForm = this.createForm();

    this.getClients();
    this.getDepartments();
    this.getUsers();
    this.getGroups();
    this.getFolders();

    this.advancedSearchService.onSearchChanged.subscribe(value => {
      if (value) {
        this.advancedSearchForm.patchValue({
          clients: value.clients, 
          departments: value.departments, 
          users: value.users, 
          userGroups: value.userGroups, 
          folders: value.folders,
          startDate: value.startDate,
          endDate: value.endDate,
          searchString: value.searchString
        });
      }
    });

    this.dataSource = new FilesDataSource(this.advancedSearchService, this.paginator, this.sort);
  }

  createForm(): FormGroup { 
    return this._formBuilder.group({
      clients: [],
      departments: [],
      users: [],
      userGroups: [],
      folders: [],
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

  getFolders() {
    this.foldersService.getFileStorage(1)
      .then(fileStorage => {
        this.folders = fileStorage.storages.filter(fold => fold.isDirectory);
      });
  }

  search() {

    var value = {
      clients: this.advancedSearchForm.value.clients ? this.advancedSearchForm.value.clients : [],
      departments: this.advancedSearchForm.value.departments ? this.advancedSearchForm.value.departments : [],
      users: this.advancedSearchForm.value.users ? this.advancedSearchForm.value.users : [],
      userGroups: this.advancedSearchForm.value.userGroups ? this.advancedSearchForm.value.userGroups : [],
      folders: this.advancedSearchForm.value.folders ? this.advancedSearchForm.value.folders : [],
      startDate: this.advancedSearchForm.value.startDate,
      endDate: this.advancedSearchForm.value.endDate,
      searchString: this.advancedSearchForm.value.searchString
    }

    this.advancedSearchService.onSearchChanged.next(value);

    var search = {
      ClientIds: value.clients.map(client => client.id),
      DepartmentIds: value.departments.map(department => department.id),
      UserIds: value.users.map(user => user.id),
      UserGroupIds: value.userGroups.map(group => group.id),
      FolderIds: value.folders.map(folder => folder.id),
      StartDate: value.startDate,
      EndDate: value.endDate,
      SearchString: value.searchString
    };

    this.advancedSearchService.search(search)
      .then()
      .catch();
  }

  seeInFolder(fileStorage) {

    this.fileManagerService.getParent(fileStorage.id)
      .then(res => {
        if (res) {
          this.router.navigate([`/file-manager/${res.id}`]);
        }
        else {
          this.router.navigate(['/file-manager/shared-with-me']);
        }
      })
      .catch();
  }

  ngOnDestroy(): void {
        
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  clientCompare(client1: Client, client2: Client) {
    return client1 && client2 && client1.id == client2.id;
  }

  departmentCompare(department1: Department, department2: Department) {
    return department1 && department2 && department1.id == department2.id;
  }

  userCompare(user1: AppUser, user2: AppUser) {
    return user1 && user2 && user1.id == user2.id;
  }

  groupCompare(group1: Group, group2: Group) {
    return group1 && group2 && group1.id == group2.id;
  }

  folderCompare(folder1: Storage, folder2: Storage) {
    return folder1 && folder2 && folder1.id == folder2.id;
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
          [propertyA, propertyB] = [a.name.toLowerCase(), b.name.toLowerCase()];
          break;
        case 'extension':
          [propertyA, propertyB] = [ a.file ? a.file.extension.toLowerCase() : null, b.file ?  b.file.extension.toLowerCase() : null];
          break;
        case 'updateDate':
          [propertyA, propertyB] = [a.updateDate ? a.updateDate : a.createDate, b.updateDate ? b.updateDate : b.createDate];
          break;
        case 'updateBy':
          [propertyA, propertyB] = [a.updateBy ? a.updateBy.userName.toLowerCase() : a.createBy.userName.toLowerCase(), b.updateBy ? b.updateBy.userName.toLowerCase() : b.createBy.userName.toLowerCase()];
          break;
        case 'size':
          [propertyA, propertyB] = [a.file ? a.file.size : "",  b.file ?  b.file.size : ""];
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