import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subject, Observable, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { ConfirmFormComponent } from '../../confirm-form/confirm-form.component';
import { GroupsService } from './groups.service';
import { GroupFormComponent } from './group-form/group-form.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GroupsComponent implements OnInit {

  dataSource: FilesDataSource | null;
  displayedColumns = ['name', 'users', 'buttons'];

  groupDialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private groupsService: GroupsService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.groupsService, this.paginator, this.sort);
  }

  add() {
    this.groupDialogRef = this._matDialog.open(GroupFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.USERGROUPS.ADD'
      }
    });

    this.groupDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        if (form && form.valid) {

          var group = {
            Name: form.controls['name'].value,
            UserIds: form.controls['users'].value.map(user => user.id)
          };

          this.groupsService.add(group)
            .then(() => {
              this.dataSource = new FilesDataSource(this.groupsService, this.paginator, this.sort);
              
              this.translateService.get('PAGES.APPS.USERGROUPS.ADDSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
              
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.USERGROUPS.' + res.error).subscribe(message => {
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

  update(group) {
    this.groupDialogRef = this._matDialog.open(GroupFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.USERGROUPS.EDIT',
        group: group
      }
    });

    this.groupDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        if (form && form.valid && form.controls['id'].value) {

          var group = {
            Id: form.controls['id'].value,
            Name: form.controls['name'].value,
            UserIds: form.controls['users'].value.map(user => user.id)
          };

          this.groupsService.update(group)
            .then(() => {
              this.dataSource = new FilesDataSource(this.groupsService, this.paginator, this.sort);
              
              this.translateService.get('PAGES.APPS.USERGROUPS.UPDATESUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
              
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.USERGROUPS.' + res.error).subscribe(message => {
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

  remove(groupId) {

    this.translateService.get('PAGES.APPS.USERGROUPS.REMOVEQUESTION').subscribe(message => {
      this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = message;

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {

          var group = {
            Id: groupId
          };

          this.groupsService.remove(group)
            .then(() => {
              this.dataSource = new FilesDataSource(this.groupsService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.USERGROUPS.REMOVESUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.translateService.get('PAGES.APPS.USERGROUPS.' + res.error).subscribe(message => {
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

  constructor(private groupsService: GroupsService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort) {
    super();
    this.filteredData = this.groupsService.groups;
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.groupsService.onGroupsChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges)
    .pipe(map(() => {
      let data = this.groupsService.groups.slice();

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

  disconnect(): void {
  }
}
