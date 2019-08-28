import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { AuthenticationService } from 'app/main/authentication/authentication.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { FolderFormComponent } from '../folder-form/folder-form.component';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmFormComponent } from 'app/main/confirm-form/confirm-form.component';
import { Storage, FileStorage, PermissionType } from 'app/main/models/file-storage.model';
import { FileFormComponent } from '../file-form/file-form.component';
import { RoleType } from 'app/main/models/role.model';
import { PermissionFormComponent } from '../permission-form/permission-form.component';
import { AppUser } from 'app/main/models/app-user.model';
import { Client } from 'app/main/models/client.model';

@Component({
    selector     : 'file-list',
    templateUrl  : './file-list.component.html',
    styleUrls    : ['./file-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerFileListComponent implements OnInit, OnDestroy {
    
    currentUser: AppUser;
    storages: Storage[] = [];
    selected: Storage;

    private fileStorage: FileStorage;

    private commonColumns = ['icon', 'name', 'modified', 'button'];
    private userColumns = ['icon', 'name', 'modified', 'access', 'button'];
    displayedColumns;
    
    folderDialogRef: any;
    fileDialogRef: any;
    permissionDialogRef: any;

    confirmDialogRef: MatDialogRef<ConfirmFormComponent>;

    private _unsubscribeAll: Subject<any>;
    
    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private _matDialog: MatDialog,
        private translateService: TranslateService,
        private _matSnackBar: MatSnackBar) {
            
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this._fileManagerService.onFileStorageChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fileStorage => {
                this.fileStorage = fileStorage;
                this.storages = fileStorage.storages;

                if (!fileStorage.client && !fileStorage.owner || (fileStorage.client && !fileStorage.owner)) {
                    this.displayedColumns = this.commonColumns;
                }
                else if (!fileStorage.client && fileStorage.owner) {
                    this.displayedColumns = this.userColumns;
                }
                else {
                    this.displayedColumns = this.commonColumns;
                }

                this.authenticationService.user$
                    .subscribe(user => {
                        
                        this.currentUser = user;
                        this.storages.forEach(storage => {
                            
                            var isAvailable = (user.id != undefined && !storage.client && !storage.owner && user.role.type == RoleType.SuperAdmin)
                                || (storage.client && !storage.owner && user.role.type == RoleType.ClientAdmin)
                                || (!storage.client && storage.owner && user.id == storage.owner.id && 
                                    (user.role.type == RoleType.DepartmentHead || user.role.type == RoleType.Employee
                                        || user.id == storage.owner.id))

                            if (isAvailable) {
                                storage.isAvailableToUpdate = true;
                            }
                            else {
                                storage.isAvailableToUpdate = false;
                            }

                            var permission = storage.permissions.length > 0 ? storage.permissions.find(perm => {
                                return perm.recipient.id == user.id && perm.type == PermissionType.readAndWrite;
                            }) : null;

                            if (isAvailable || permission) {
                                storage.isAvailableToAddPermision = true;
                            }
                            else {
                                storage.isAvailableToAddPermision = false;
                            }
                        });
                    });
            });

        this._fileManagerService.onStorageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
    }

    getChildStorages(storage){

        if (storage.isDirectory) {

            this.router.navigate([`/file-manager/${storage.id}`]);
        }
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSelect(selected): void {
        this._fileManagerService.onStorageSelected.next(selected);
        this._fuseSidebarService.getSidebar('file-manager-details-sidebar').toggleOpen();
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    update(fileStorage) {

        if (fileStorage.isDirectory) {
            this.updateFolder(fileStorage);
        }
        else {
            this.updateFile(fileStorage);
        }
    }

    private updateFolder(folder) {
        var folderId = folder.id;
        
        this.translateService.get('PAGES.APPS.FILEMANAGER.UPDATEFOLDER')
            .subscribe(message => {

                this.folderDialogRef = this._matDialog.open(FolderFormComponent, {
                    panelClass: 'form-dialog',
                    data: {
                        parentId: this.fileStorage.id,
                        name: folder.name,
                        title: message
                    }
                });

                this.folderDialogRef.afterClosed()
                    .subscribe((form: FormGroup) => {
                    
                    if (form && form.valid) {
            
                        var folder = {
                            id: folderId,
                            name: form.controls['name'].value
                        };
                
                        this._fileManagerService.updateFolder(folder, this.fileStorage.id)
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

    private updateFile(file) {

        var fileId = file.id;
        
        this.translateService.get('PAGES.APPS.FILEMANAGER.UPDATEFILE')
            .subscribe(message => {

                this.fileDialogRef = this._matDialog.open(FileFormComponent, {
                    panelClass: 'form-dialog',
                    data: {
                        parentId: this.fileStorage.id,
                        name: file.name + file.file.extension,
                        title: message
                    }
                });

                this.fileDialogRef.afterClosed()
                    .subscribe((form: FormGroup) => {
                    
                    if (form && form.valid) {
            
                        var body = {
                            id: fileId,
                            name: form.controls['name'].value
                        };

                        if (form.controls['content'].value) {
                            body['content'] = form.controls['content'].value;
                            body['size'] = form.controls['size'].value;
                        }
                        
                        this._fileManagerService.updateFile(body, this.fileStorage.id)
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

    remove(fileStorage) {
        var fileStorageId = fileStorage.id;

        this.translateService.get(fileStorage.isDirectory ? 'PAGES.APPS.FILEMANAGER.FOLDERREMOVEQUESTION' : 'PAGES.APPS.FILEMANAGER.FILEREMOVEQUESTION')
            .subscribe(message => {
                
                this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
                    disableClose: false
                });
        
                this.confirmDialogRef.componentInstance.confirmMessage = message;
        
                this.confirmDialogRef.afterClosed()
                    .subscribe(result => {
                        
                        if (result) {
                
                            var data = {
                                id: fileStorageId
                            }

                            if (fileStorage.isDirectory) {
                                
                                this._fileManagerService.removeFolder(data, this.fileStorage.id)
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
                            else {
                                this._fileManagerService.removeFile(data, this.fileStorage.id)
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
                        }
                        
                    this.confirmDialogRef = null;
                });
          });
    }

    downloadFile(file) {
        this._fileManagerService.downloadFile(file.id, file.owner, file.client);
    }

    addPermission(fileStorage) {
        var fileStorageId = fileStorage.id;
        var permissions = fileStorage.permissions;
        
        this.translateService.get('PAGES.APPS.FILEMANAGER.ADDPERMISSION')
            .subscribe(message => {

                this.permissionDialogRef = this._matDialog.open(PermissionFormComponent, {
                    panelClass: 'permission-form-dialog',
                    data: {
                        fileStorageId: fileStorageId,
                        permissions: permissions,
                        title: message,
                        currentUserId: this.currentUser.id
                    }
                });

                this.permissionDialogRef.afterClosed()
                    .subscribe((form: FormGroup) => {
                    
                        if (form && form.valid) {

                            var permission = {
                                UserIds: form.controls['objects'].value.filter(data => data instanceof AppUser).map(data => data.id),
                                ClientIds: form.controls['objects'].value.filter(data => data instanceof Client).map(data => data.id),
                                FileStorageId: form.controls['fileStorageId'].value,
                                Type: form.controls['type'].value
                            };

                            this._fileManagerService.checkPermission(permission, this.fileStorage.id)
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

    createSnackBar(message: string) {
        this._matSnackBar.open(message, 'OK', {
            verticalPosition: 'top',
            duration: 2000
        });
    }
}
