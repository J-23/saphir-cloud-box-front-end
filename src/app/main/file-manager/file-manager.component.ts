import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { MatDialog, _MatChipListMixinBase } from '@angular/material';
import { FolderFormComponent } from './folder-form/folder-form.component';
import { FormGroup } from '@angular/forms';
import { FileFormComponent } from './file-form/file-form.component';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector     : 'file-manager',
    templateUrl  : './file-manager.component.html',
    styleUrls    : ['./file-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerComponent implements OnInit, OnDestroy {
    selected: any;

    folderDialogRef: any;
    fileDialogRef: any;

    location: string;
    storage: any;

    private _unsubscribeAll: Subject<any>;
    
    buttonAddIsAvailable: boolean = false;

    isRootFolder: boolean = false;

    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private authenticationService: AuthenticationService,
        private router: Router) {
            
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
            .subscribe(storage => {

                this.storage = storage;

                if (this.storage.parentStorageId == 1) {
                    this.isRootFolder = true;
                }
                else {
                    this.isRootFolder = false;
                }

                console.log(this.storage,this.isRootFolder)
                this.authenticationService.user$
                    .subscribe(user => {

                        if ((!storage.client && !storage.owner && (user.role.name == 'SUPER ADMIN'))
                            || (storage.client && !storage.owner && user.role.name == 'CLIENT ADMIN')
                            || (!storage.client && storage.owner && (user.role.name == 'DEPARTMENT HEAD' || user.role.name == 'EMPLOYEE' || user.id == storage.owner.id))) {
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
                parentId: this.storage.parentStorageId
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
                .catch(res => { });
            }
          });
    }

    addFile() {
        this.fileDialogRef = this._matDialog.open(FileFormComponent, {
            panelClass: 'form-dialog',
            data: {
                parentId: this.storage.parentStorageId
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
                        content: base64
                    };

                    this._fileManagerService.addFile(file)
                        .then(() => { })
                        .catch(res => { });
                };
            }
          });
    }

    goBack() {
        this.router.navigate([`/file-manager/${this.storage.parentStorageId}`]);
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
