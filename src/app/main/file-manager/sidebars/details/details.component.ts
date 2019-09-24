import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Storage, PermissionType } from 'app/main/models/file-storage.model';
import { AuthenticationService } from 'app/main/authentication/authentication.service';
import { RoleType } from 'app/main/models/role.model';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { ConfirmFormComponent } from 'app/main/confirm-form/confirm-form.component';
import { PermissionFormComponent } from '../../permission-form/permission-form.component';
import { FormGroup } from '@angular/forms';
import { FileFormComponent } from '../../file-form/file-form.component';
import { FolderFormComponent } from '../../folder-form/folder-form.component';
import { AppUser } from 'app/main/models/app-user.model';
import { Client } from 'app/main/models/client.model';
import { EditPermissionFormComponent } from '../../edit-permission-form/edit-permission-form.component';
import { Group } from 'app/main/models/group.model';

@Component({
    selector   : 'file-manager-details-sidebar',
    templateUrl: './details.component.html',
    styleUrls  : ['./details.component.scss'],
    animations : fuseAnimations
})
export class FileManagerDetailsSidebarComponent implements OnInit, OnDestroy {

    currentUser: AppUser;

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

    isAvailableToUpdate: boolean = false;
    isAvailableToOpenPermission: boolean = false;
    isAvailableToAddPermission: boolean = false;
    isAvailableToUpdatePermission: boolean = false;

    folderDialogRef: any;
    fileDialogRef: any;
    permissionDialogRef: any;
    editPermissionDialogRef: any;

    ngOnInit(): void {

        this._fileManagerService.onStorageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {

                this.selected = selected;

                if ( this.selected) {
                    this.authenticationService.user$
                        .subscribe(user => {

                            this.currentUser = user;

                            var isAvailable = (user.id != undefined && !this.selected.client && !this.selected.owner && user.role.type == RoleType.SuperAdmin)
                                || (this.selected.client && !this.selected.owner && user.role.type == RoleType.ClientAdmin)
                                || (!this.selected.client && this.selected.owner && user.id == this.selected.owner.id && 
                                    (user.role.type == RoleType.DepartmentHead || user.role.type == RoleType.Employee
                                        || user.id == this.selected.owner.id))

                            if (isAvailable) {
                                this.isAvailableToUpdate = true;
                                this.isAvailableToUpdatePermission = true;
                            }
                            else {
                                this.isAvailableToUpdate = false;
                                this.isAvailableToUpdatePermission = false;
                            }
                            
                            var permission = this.selected.permissions.find(permission => {
                                return permission.recipient.id == user.id
                            });


                            if (permission || isAvailable) {
                                this.isAvailableToOpenPermission = true;

                                permission = this.selected.permissions.find(perm => {
                                    return perm.recipient.id == user.id && perm.type == PermissionType.readAndWrite
                                });

                                if (permission || isAvailable) {
                                    this.isAvailableToAddPermission = true;
                                }
                                else {
                                    this.isAvailableToAddPermission = false;
                                }
                            }
                            else {
                                this.isAvailableToOpenPermission = false;
                                this.isAvailableToAddPermission = false;
                                this.isAvailableToUpdatePermission = false;
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

    editPermission(currentPermission) {
        
        this.translateService.get('PAGES.APPS.FILEMANAGER.EDITPERMISSION')
            .subscribe(message => {

                this.editPermissionDialogRef = this._matDialog.open(EditPermissionFormComponent, {
                    panelClass: 'permission-form-dialog',
                    data: {
                        fileStorageId: this.selected.id,
                        title: message,
                        recipientEmail: currentPermission.recipient.email,
                        type: currentPermission.type
                    }
                });

                this.editPermissionDialogRef.afterClosed()
                    .subscribe((form: FormGroup) => {
                        
                        if (form && form.valid) {

                            var permission = {
                                RecipientId: currentPermission.recipient.id,
                                FileStorageId: form.controls['fileStorageId'].value,
                                Type: form.controls['type'].value
                            };

                            this._fileManagerService.updatePermission(permission, this.fileStorageId)
                                .then(() => {
                                    this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSIONEDITSUCCESS').subscribe(message => {
                                        this.createSnackBar(message);
                                    });
                                })
                                .catch(res => {
                                    if (res && res.status && res.status == 403) {
                                    this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSION_' + res.error).subscribe(message => {
                                        this.createSnackBar(message);
                                    });
                                    }
                                    
                                    else if (res && res.status && res.status == 500) {
                                        this.translateService.get('COMMONACTIONS.OOPS').subscribe(message => {
                                          this.createSnackBar(message);
                                        });
                                    }
                                    else if (res && res.status && res.status == 401) {
                                        this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSION_' + res.error).subscribe(message => {
                                            this.createSnackBar(message);
                                        });
                                    }
                                });
                            }
                    });
                });    
    }

    deletePermission(permission) {

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
                                RecipientId: permission.recipient.id,
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
                                        this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSION_' + res.error).subscribe(message => {
                                            this.createSnackBar(message);
                                        });
                                    }
                                    else if (res && res.status && res.status == 500) {
                                        this.translateService.get('COMMONACTIONS.OOPS').subscribe(message => {
                                          this.createSnackBar(message);
                                        });
                                    }
                                    else if (res && res.status && res.status == 401) {
                                        this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSION_' + res.error).subscribe(message => {
                                            this.createSnackBar(message);
                                        });
                                    }
                                });
                        }
                        
                    this.confirmDialogRef = null;
                });
          });
    }

    downloadFile() {
        this._fileManagerService.downloadFile(this.selected.id)
            .subscribe(blob => {
                        
                var FileSaver = require('file-saver');
                FileSaver.saveAs(blob, this.selected.name + this.selected.file.extension);
            });
    }

    update() {

        if (this.selected.isDirectory) {
            this.updateFolder();
        }
        else {
            this.updateFile();
        }
    }

    private updateFile() {
        
        this.translateService.get('PAGES.APPS.FILEMANAGER.UPDATEFILE')
            .subscribe(message => {

                this.fileDialogRef = this._matDialog.open(FileFormComponent, {
                    panelClass: 'form-dialog',
                    data: {
                        parentId: this.fileStorageId,
                        name: this.selected.name + this.selected.file.extension,
                        title: message
                    }
                });

                this.fileDialogRef.afterClosed()
                    .subscribe((form: FormGroup) => {
                    
                    if (form && form.valid) {
            
                        var body = {
                            id: this.selected.id,
                            name: form.controls['name'].value
                        };

                        if (form.controls['content'].value) {
                            body['content'] = form.controls['content'].value;
                            body['size'] = form.controls['size'].value;
                        }
                        
                        this._fileManagerService.updateFile(body, this.fileStorageId)
                            .then()
                            .catch(res => {
                                if (res && res.status && res.status == 403) {
                                    this.translateService.get('PAGES.APPS.FILEMANAGER.FILE_' + res.error).subscribe(message => {
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
            });
    }

    private updateFolder() {
        
        this.translateService.get('PAGES.APPS.FILEMANAGER.UPDATEFOLDER')
            .subscribe(message => {

                this.folderDialogRef = this._matDialog.open(FolderFormComponent, {
                    panelClass: 'form-dialog',
                    data: {
                        parentId: this.fileStorageId,
                        name: this.selected.name,
                        title: message
                    }
                });

                this.folderDialogRef.afterClosed()
                    .subscribe((form: FormGroup) => {
                    
                    if (form && form.valid) {
            
                        var folder = {
                            id: this.selected.id,
                            name: form.controls['name'].value
                        };
                
                        this._fileManagerService.updateFolder(folder, this.fileStorageId)
                            .then(() => { })
                            .catch(res => { 
                                if (res && res.status && res.status == 403) {
                                    this.translateService.get('PAGES.APPS.FILEMANAGER.FOLDER_' + res.error).subscribe(message => {
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
            });
    }

    remove() {

        this.translateService.get(this.selected.isDirectory ? 'PAGES.APPS.FILEMANAGER.FOLDERREMOVEQUESTION' : 'PAGES.APPS.FILEMANAGER.FILEREMOVEQUESTION')
            .subscribe(message => {
                
                this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
                    disableClose: false
                });
        
                this.confirmDialogRef.componentInstance.confirmMessage = message;
        
                this.confirmDialogRef.afterClosed()
                    .subscribe(result => {
                        
                        if (result) {
                
                            var data = {
                                id: this.selected.id
                            }

                            if (this.selected.isDirectory) {
                                
                                this.removeFolder(data);
                            }
                            else {
                                this.removeFile(data);
                            }
                        }
                        
                    this.confirmDialogRef = null;
                });
          });
    }

    private removeFile(data) {
        this._fileManagerService.removeFile(data, this.fileStorageId)
        .then(() => {
            this.translateService.get('PAGES.APPS.FILEMANAGER.FILEREMOVESUCCESS').subscribe(message => {
            this.createSnackBar(message);
            });
        })
        .catch(res => {
            if (res && res.status && res.status == 403) {
            this.translateService.get('PAGES.APPS.FILEMANAGER.FILE_' + res.error).subscribe(message => {
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

    private removeFolder(data) {
        this._fileManagerService.removeFolder(data, this.fileStorageId)
        .then(() => {
            this.translateService.get('PAGES.APPS.FILEMANAGER.FOLDERREMOVESUCCESS').subscribe(message => {
            this.createSnackBar(message);
            });
        })
        .catch(res => {
            if (res && res.status && res.status == 403) {
            this.translateService.get('PAGES.APPS.FILEMANAGER.FOLDER_' + res.error).subscribe(message => {
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

    addPermission() {
        var fileStorageId = this.selected.id;
        
        this.translateService.get('PAGES.APPS.FILEMANAGER.ADDPERMISSION')
            .subscribe(message => {

                this.permissionDialogRef = this._matDialog.open(PermissionFormComponent, {
                    panelClass: 'permission-form-dialog',
                    data: {
                        fileStorageId: this.selected.id,
                        permissions: this.selected.permissions,
                        title: message,
                        currentUserId: this.currentUser.id
                    }
                });

                this.permissionDialogRef.afterClosed()
                    .subscribe((form: FormGroup) => {
                    
                        if (form && form.valid) {

                            var permission = {
                                UserIds: form.controls['userIds'].value,
                                GroupIds: form.controls['groupIds'].value,
                                ClientIds: form.controls['clientIds'].value,
                                FileStorageId: form.controls['fileStorageId'].value,
                                Type: form.controls['type'].value
                            };

                            this._fileManagerService.checkPermission(permission, this.fileStorageId)
                                .then(() => {
                                    this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSIONADDSUCCESS').subscribe(message => {
                                        this.createSnackBar(message);
                                    });
                                })
                                .catch(res => {
                                    if (res && res.status && res.status == 403) {
                                    this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSION_' + res.error).subscribe(message => {
                                        this.createSnackBar(message);
                                    });
                                    }
                                    
                                    else if (res && res.status && res.status == 500) {
                                        this.translateService.get('COMMONACTIONS.OOPS').subscribe(message => {
                                          this.createSnackBar(message);
                                        });
                                    }
                                    else if (res && res.status && res.status == 401) {
                                        this.translateService.get('PAGES.APPS.FILEMANAGER.PERMISSION_' + res.error).subscribe(message => {
                                            this.createSnackBar(message);
                                        });
                                    }
                                });
                        }
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
