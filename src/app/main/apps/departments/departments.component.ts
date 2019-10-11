import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subject, Observable, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { ConfirmFormComponent } from '../../confirm-form/confirm-form.component';
import { DepartmentsService } from './departments.service';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { FuseUtils } from '@fuse/utils';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DepartmentsComponent implements OnInit {
  dataSource: FilesDataSource | null;
  displayedColumns = ['name', 'client', 'createDate', 'updateDate', 'buttons'];

  departmentDialogRef: MatDialogRef<DepartmentFormComponent>;
  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private departmentsService: DepartmentsService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.departmentsService, this.paginator, this.sort);
  }

  addDepartment() {

    this.departmentDialogRef = this._matDialog.open(DepartmentFormComponent, {
      panelClass: 'department-form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.DEPARTMENTS.ADD'
      }
    });

    this.departmentDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        if (form && form.valid) {

          var department = {
            name: form.controls['name'].value,
            clientId: form.controls['client'].value.id
          };

          this.departmentsService.addDepartment(department)
            .then(() => {
              this.dataSource = new FilesDataSource(this.departmentsService, this.paginator, this.sort);
              
              this.translateService.get('PAGES.APPS.DEPARTMENTS.ADDSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
              
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.DEPARTMENTS.' + res.error).subscribe(message => {
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

  editDepartment(department) {
    this.departmentDialogRef = this._matDialog.open(DepartmentFormComponent, {
      panelClass: 'department-form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.DEPARTMENTS.EDIT',
        object: department
      }
    });

    this.departmentDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        
        if (form && form.valid && form.controls['id'].value) {

          var department = {
            id: form.controls['id'].value,
            name: form.controls['name'].value,
            clientId: form.controls['client'].value.id
          };

          this.departmentsService.updateDepartment(department)
            .then(() => {
              this.dataSource = new FilesDataSource(this.departmentsService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.DEPARTMENTS.EDITSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.DEPARTMENTS.' + res.error).subscribe(message => {
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

  deleteDepartment(departmentId) {
    
    this.translateService.get('PAGES.APPS.DEPARTMENTS.REMOVEQUESTION').subscribe(message => {
      this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = message;

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {

          var department = {
            id: departmentId
          };

          this.departmentsService.deleteDepartment(department)
            .then(() => {
              this.dataSource = new FilesDataSource(this.departmentsService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.DEPARTMENTS.REMOVESUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.DEPARTMENTS.' + res.error).subscribe(message => {
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export class FilesDataSource extends DataSource<any> {

  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(private departmentsService: DepartmentsService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort) {
    super();
    this.filteredData = this.departmentsService.departments;
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.departmentsService.onDepartmentsChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges)
    .pipe(map(() => {
      let data = this.departmentsService.departments.slice();
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
        case 'client':
          [propertyA, propertyB] = [a.client.name, b.client.name];
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