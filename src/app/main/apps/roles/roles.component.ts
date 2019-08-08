import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subject, Observable, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { RolesService } from './roles.service';
import { ConfirmFormComponent } from '../confirm-form/confirm-form.component';
import { RoleFormComponent } from './role-form/role-form.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RolesComponent implements OnInit {

  dataSource: FilesDataSource | null;
  displayedColumns = ['name', 'buttons'];

  roleDialogRef: MatDialogRef<RoleFormComponent>;
  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private rolesService: RolesService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.rolesService, this.paginator, this.sort);
  }

  addRole() {

    this.roleDialogRef = this._matDialog.open(RoleFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.ROLES.ADD'
      }
    });

    this.roleDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        if (form && form.valid) {

          var role = {
            name: form.controls['name'].value
          };

          this.rolesService.addRole(role)
            .then(() => {
              this.dataSource = new FilesDataSource(this.rolesService, this.paginator, this.sort);
              
              this.translateService.get('PAGES.APPS.ROLES.ADDSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
              
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.ROLES.' + res.error).subscribe(message => {
                  this.createSnackBar(message);
                });
              }
            });
        }
      });
  }

  editRole(role) {
    this.roleDialogRef = this._matDialog.open(RoleFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.ROLES.EDIT',
        object: role
      }
    });

    this.roleDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        
        if (form && form.valid && form.controls['id'].value) {

          var role = {
            id: form.controls['id'].value,
            name: form.controls['name'].value
          };

          this.rolesService.updateRole(role)
            .then(() => {
              this.dataSource = new FilesDataSource(this.rolesService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.ROLES.EDITSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.ROLES.' + res.error).subscribe(message => {
                  this.createSnackBar(message);
                });
              }
            });
        }
      });
  }

  deleteRole(roleId) {
    
    this.translateService.get('PAGES.APPS.ROLES.REMOVEQUESTION').subscribe(message => {
      this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = message;

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {

          var role = {
            id: roleId
          };

          this.rolesService.deleteRole(role)
            .then(() => {
              this.dataSource = new FilesDataSource(this.rolesService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.ROLES.REMOVESUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.ROLES.' + res.error).subscribe(message => {
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

  constructor(private rolesService: RolesService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort) {
    super();
    this.filteredData = this.rolesService.roles;
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.rolesService.onRolesChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges)
    .pipe(map(() => {
      let data = this.rolesService.roles.slice();
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
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
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