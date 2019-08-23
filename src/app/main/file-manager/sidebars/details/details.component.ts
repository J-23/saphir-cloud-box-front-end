import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Storage } from 'app/main/models/file-storage.model';
import { AuthenticationService } from 'app/main/authentication/authentication.service';
import { RoleType } from 'app/main/models/role.model';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { ConfirmFormComponent } from 'app/main/confirm-form/confirm-form.component';

@Component({
    selector   : 'file-manager-details-sidebar',
    templateUrl: './details.component.html',
    styleUrls  : ['./details.component.scss'],
    animations : fuseAnimations
})
export class FileManagerDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: Storage;
    fileStorageId: number;

    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
    
    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private authenticationService: AuthenticationService,
        private translateService: TranslateService,
        private _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar) {
        
        this._unsubscribeAll = new Subject();
    }

    buttonRemoveIsAvailable:boolean;
    buttonUpdateIsAvailable: boolean;
    permissionsAreDisabled: boolean = true;

    ngOnInit(): void {

        this._fileManagerService.onStorageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {

                this.selected = selected;

                if ( this.selected) {
                    this.authenticationService.user$
                        .subscribe(user => {
                            if ((!this.selected.client && !this.selected.owner && user.role.type == RoleType.SuperAdmin)
                                || (this.selected.client && !this.selected.owner && user.role.type == RoleType.ClientAdmin)
                                || (!this.selected.client && this.selected.owner && (user.role.type == RoleType.DepartmentHead || user.role.type == RoleType.Employee
                                || user.id == this.selected.owner.id))) {
                                this.buttonRemoveIsAvailable = true;
                                this.buttonUpdateIsAvailable = true;
                            }
                            else {
                                

                                this.buttonRemoveIsAvailable = false;
                                this.buttonUpdateIsAvailable = false;
                            }
                            
                            var permission = this.selected.permissions.find(permission => {
                                return permission.recipient.id == user.id
                            });


                            if (permission || (!this.selected.client && !this.selected.owner && user.role.type == RoleType.SuperAdmin)
                            || (this.selected.client && !this.selected.owner && user.role.type == RoleType.ClientAdmin)
                            || (!this.selected.client && this.selected.owner && (user.role.type == RoleType.DepartmentHead || user.role.type == RoleType.Employee
                            || user.id == this.selected.owner.id))) {
                                this.permissionsAreDisabled = false;
                            }
                            else {
                                this.permissionsAreDisabled = true;
                            }
                        });
                }
            });

        this._fileManagerService.onFileStorageChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fileStorage => {

                if (fileStorage) {
                    this.fileStorageId = fileStorage.id;
                }
            });
    }

    close() {
        this._fuseSidebarService.getSidebar('file-manager-details-sidebar').toggleOpen();
    }

    edit(permission) {

    }

    delete(permission) {

        this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSIONREMOVEQUESTION')
            .subscribe(message => {
                
                this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
                    disableClose: false
                });
        
                this.confirmDialogRef.componentInstance.confirmMessage = message;
        
                this.confirmDialogRef.afterClosed()
                    .subscribe(result => {
                        
                        if (result) {
                
                            var data = {
                                RecipientEmail: permission.recipient.email,
                                FileStorageId: this.selected.id
                            }

                            this._fileManagerService.removePermission(data, this.fileStorageId)
                                .then(() => {
                                    this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSIONREMOVESUCCESS').subscribe(message => {
                                        this.createSnackBar(message);
                                    });
                                })
                                .catch(res => {
                                    if (res && res.status && res.status == 403) {
                                        this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSION' + res.error).subscribe(message => {
                                            this.createSnackBar(message);
                                        });
                                    }
                                });
                        }
                        
                    this.confirmDialogRef = null;
                });
          });
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createSnackBar(message: string) {
        this._matSnackBar.open(message, 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
    }
}
