import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { MatDialog, _MatChipListMixinBase, MatSnackBar } from '@angular/material';
import { FolderFormComponent } from './folder-form/folder-form.component';
import { FormGroup } from '@angular/forms';
import { FileFormComponent } from './file-form/file-form.component';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Storage, FileStorage } from '../models/file-storage.model';

@Component({
    selector     : 'file-manager',
    templateUrl  : './file-manager.component.html',
    styleUrls    : ['./file-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerComponent implements OnInit, OnDestroy {
    selected: Storage;

    folderDialogRef: any;
    fileDialogRef: any;

    location: string;
    fileStorage: FileStorage;

    private _unsubscribeAll: Subject<any>;
    
    buttonAddIsAvailable: boolean = false;

    isRootFolder: boolean = false;

    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private authenticationService: AuthenticationService,
        private router: Router,
        private _matSnackBar: MatSnackBar,
        private translateService: TranslateService) {
            
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this._fileManagerService.onStorageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
            this.selected = selected;
            
        });
        
        this._fileManagerService.onFileStorageChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fileStorage => {

                this.fileStorage = fileStorage;

                if (this.fileStorage.parentStorageId == 1) {
                    this.isRootFolder = true;
                }
                else {
                    this.isRootFolder = false;
                }

                this.authenticationService.user$
                    .subscribe(user => {

                        if ((!this.fileStorage.client && !this.fileStorage.owner && (user.role.name == 'SUPER ADMIN'))
                            || (this.fileStorage.client && !this.fileStorage.owner && user.role.name == 'CLIENT ADMIN')
                            || (!this.fileStorage.client && this.fileStorage.owner && (user.role.name == 'DEPARTMENT HEAD' || user.role.name == 'EMPLOYEE' 
                            || user.id == this.fileStorage.owner.id))) {
                            this.buttonAddIsAvailable = true;
                        }
                        else {
                            this.buttonAddIsAvailable = false;
                        }
                    })
            });
    }

    addFolder() {
        this.folderDialogRef = this._matDialog.open(FolderFormComponent, {
            panelClass: 'form-dialog',
            data: {
                parentId: this.fileStorage.id
            }
        });

        this.folderDialogRef.afterClosed()
            .subscribe((form: FormGroup) => {
            
            if (form && form.valid) {
    
              var folder = {
                parentId: form.controls['parentId'].value,
                name: form.controls['name'].value
              };
    
              this._fileManagerService.addFolder(folder)
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

    addFile() {
        this.fileDialogRef = this._matDialog.open(FileFormComponent, {
            panelClass: 'form-dialog',
            data: {
                parentId: this.fileStorage.id
            }
        });

        this.fileDialogRef.afterClosed()
            .subscribe((form: FormGroup) => {
            
            if (form && form.valid) {
    
                const reader = new FileReader();
                reader.readAsDataURL(form.controls['content'].value);
                reader.onload = () => {
                    const base64 = reader.result.toString().split(',')[1];

                    var file = {
                        parentId: form.controls['parentId'].value,
                        name: form.controls['content'].value.name,
                        content: base64,
                        size: form.controls['size'].value
                    };

                    this._fileManagerService.addFile(file)
                        .then(() => { })
                        .catch(res => { 
                            if (res && res.status && res.status == 403) {
                                this.translateService.get('PAGES.APPS.FILEMANAGER.' + res.error).subscribe(message => {
                                  this.createSnackBar(message);
                                });
                            }
                        });
                };
            }
          });
    }

    goBack() {
        this.router.navigate([`/file-manager/${this.fileStorage.parentStorageId}`]);
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    createSnackBar(message: string) {
        this._matSnackBar.open(message, 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      }
}
