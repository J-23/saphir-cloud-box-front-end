import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subject, Observable, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { UsersService } from './users.service';
import { ConfirmFormComponent } from '../../confirm-form/confirm-form.component';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  dataSource: FilesDataSource | null;
  displayedColumns = ['userName', 'email', 'client', 'department', 'role', 'createDate', 'updateDate', 'buttons'];

  userDialogRef: MatDialogRef<UserFormComponent>;
  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private usersService: UsersService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);
  }

  addUser() {

    this.userDialogRef = this._matDialog.open(UserFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.USERS.ADD'
      }
    });

    this.userDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        if (form && form.valid) {

          var user = {
            userName: form.controls['userName'].value,
            email: form.controls['email'].value,
            clientId: form.controls['client'].value.id,
            departmentId: form.controls['department'].value ? form.controls['department'].value.id : null,
            roleId: form.controls['role'].value.id
          };

          this.usersService.addUser(user)
            .then(() => {
              this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);
              
              this.translateService.get('PAGES.APPS.USERS.ADDSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
              
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.USERS.' + res.error).subscribe(message => {
                  this.createSnackBar(message);
                });
              }
              else if (res && res.status && res.status == 500) {
                this.translateService.get('COMMONACTIONS.OOPS').subscribe(message => {
                  this.createSnackBar(message);
                });
              }
            });
        }
      });
  }

  editUser(user) {
    this.userDialogRef = this._matDialog.open(UserFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.USERS.EDIT',
        object: user
      }
    });

    this.userDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        
        if (form && form.valid && form.controls['id'].value) {

          var user = {
            id: form.controls['id'].value,
            userName: form.controls['userName'].value,
            email: form.controls['email'].value,
            clientId: form.controls['client'].value.id,
            departmentId: form.controls['department'].value ? form.controls['department'].value.id : null,
            roleId: form.controls['role'].value.id
          };

          this.usersService.updateUser(user)
            .then(() => {
              this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.USERS.EDITSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.USERS.USERS.' + res.error).subscribe(message => {
                  this.createSnackBar(message);
                });
              }
              else if (res && res.status && res.status == 500) {
                this.translateService.get('COMMONACTIONS.OOPS').subscribe(message => {
                  this.createSnackBar(message);
                });
              }
            });
        }
      });
  }

  deleteUser(userId) {
    
    this.translateService.get('PAGES.APPS.USERS.REMOVEQUESTION').subscribe(message => {
      this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = message;

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {

          var user = {
            id: userId
          };

          this.usersService.deleteUser(user)
            .then(() => {
              this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.USERS.REMOVESUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.USERS.' + res.error).subscribe(message => {
                  this.createSnackBar(message);
                });
              }
              else if (res && res.status && res.status == 500) {
                this.translateService.get('COMMONACTIONS.OOPS').subscribe(message => {
                  this.createSnackBar(message);
                });
              }
            });
        }
        this.confirmDialogRef = null;
      });
    });
  }

  createSnackBar(message: string) {
    this._matSnackBar.open(message, 'OK', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
}

export class FilesDataSource extends DataSource<any> {

  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(private usersService: UsersService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort) {
    super();
    this.filteredData = this.usersService.users;
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.usersService.onUsersChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges)
    .pipe(map(() => {
      let data = this.usersService.users.slice();
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
    return data;
  }

  sortData(data): any[] {
    if (!this._matSort.active || this._matSort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch ( this._matSort.active ) {
        case 'userName':
          [propertyA, propertyB] = [a.userName, b.userName];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'client':
          [propertyA, propertyB] = [a.client.name, b.client.name];
          break;
        case 'department':
          [propertyA, propertyB] = [a.department.name, b.department.name];
          break;
        case 'role':
          [propertyA, propertyB] = [a.role.name, b.role.name];
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