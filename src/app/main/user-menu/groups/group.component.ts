import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Subject, Observable, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { ConfirmFormComponent } from '../../confirm-form/confirm-form.component';
import { GroupService } from './group.service';
import { GroupFormComponent } from './group-form/group-form.component';
import { Group } from 'app/main/models/group.model';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
  selector: 'app-groups',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GroupComponent implements OnInit {

  group: Group;

  groupDialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  
  constructor(private groupService: GroupService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private fuseNavigationService: FuseNavigationService) { }

  ngOnInit() {
    this.groupService.onGroupChanged
      .subscribe(group => {
        this.group = group;
      });
  }

  update() {
    this.groupDialogRef = this._matDialog.open(GroupFormComponent, {
      panelClass: 'group-form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.USERGROUPS.EDIT',
        group: this.group
      }
    });

    this.groupDialogRef.afterClosed()
      .subscribe((form: FormGroup) => {
        if (form && form.valid) {

          var group = {
            Id: this.group.id,
            Name: form.controls['name'].value,
            UserIds: form.controls['users'].value.map(user => user.id)
          };

          this.groupService.update(group)
            .then(() => {

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

  remove() {

    this.translateService.get('PAGES.APPS.USERGROUPS.REMOVEQUESTION').subscribe(message => {
      this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = message;

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {

          var group = {
            Id: this.group.id
          };

          this.groupService.remove(group)
            .then(() => {

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