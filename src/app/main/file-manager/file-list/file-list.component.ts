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

@Component({
    selector     : 'file-list',
    templateUrl  : './file-list.component.html',
    styleUrls    : ['./file-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerFileListComponent implements OnInit, OnDestroy {
    storages: any;

    private storageId: number;

    private commonColumns = ['icon', 'name', 'modified', 'button'];
    private userColumns = ['icon', 'name', 'modified', 'access', 'button'];

    displayedColumns;
    selected: any;

    buttonRemoveIsAvailable: boolean = false;
    buttonUpdateIsAvailable: boolean = false;

    folderDialogRef: any;

    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
    
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
                this.storageId = fileStorage.id;
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
                        if ((!fileStorage.client && !fileStorage.owner && user.role.name == 'SUPER ADMIN')
                            || (fileStorage.client && !fileStorage.owner && user.role.name == 'CLIENT ADMIN')
                            || (!fileStorage.client && fileStorage.owner && (user.role.name == 'DEPARTMENT HEAD' || user.role.name == 'EMPLOYEE' || user.id == fileStorage.owner.id))) {
                            this.buttonRemoveIsAvailable = true;
                            this.buttonUpdateIsAvailable = true;
                        }
                        else {
                            this.buttonRemoveIsAvailable = false;
                            this.buttonUpdateIsAvailable = false;
                        }
                    })
                
            });

        this._fileManagerService.onStorageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
    }

    getChildStorages(storage){
        this.router.navigate([`/file-manager/${storage.id}`]);
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSelect(selected): void {
        this._fileManagerService.onStorageSelected.next(selected);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    updateFolder(folder) {

        var folderId = folder.id;

        this.folderDialogRef = this._matDialog.open(FolderFormComponent, {
            panelClass: 'form-dialog',
            data: {
                parentId: this.storageId,
                name: folder.name
            }
        });

        this.folderDialogRef.afterClosed()
            .subscribe((form: FormGroup) => {
            
            if (form && form.valid) {
    
                var folder = {
                    id: folderId,
                    name: form.controls['name'].value
                };
        
                this._fileManagerService.updateFolder(folder, this.storageId)
                    .then(() => { })
                    .catch(res => { 
                        if (res && res.status && res.status == 403) {
                            this.translateService.get('PAGES.APPS.FILEMANAGER.FOLDER' + res.error).subscribe(message => {
                              this.createSnackBar(message);
                            });
                        }
                    });
            }
          });
    }

    removeFolder(folder) {
        var folderId = folder.id;

        this.translateService.get('PAGES.APPS.FILEMANAGER.FOLDERREMOVEQUESTION').subscribe(message => {
            this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
              disableClose: false
            });
      
            this.confirmDialogRef.componentInstance.confirmMessage = message;
      
            this.confirmDialogRef.afterClosed().subscribe(result => {
              if (result) {
      
                var folder = {
                  id: folderId
                };
      
                this._fileManagerService.removeFolder(folder, this.storageId)
                  .then(() => {
                    this.translateService.get('PAGES.APPS.FILEMANAGER.FOLDERREMOVESUCCESS').subscribe(message => {
                      this.createSnackBar(message);
                    });
                  })
                  .catch(res => {
                    if (res && res.status && res.status == 403) {
                      this.translateService.get('PAGES.APPS.FILEMANAGER.FOLDER' + res.error).subscribe(message => {
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
