import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { MatDialog } from '@angular/material';
import { FolderFormComponent } from './folder-form/folder-form.component';
import { FormGroup } from '@angular/forms';
import { FileFormComponent } from './file-form/file-form.component';

@Component({
    selector     : 'file-manager',
    templateUrl  : './file-manager.component.html',
    styleUrls    : ['./file-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerComponent implements OnInit, OnDestroy {
    selected: any;
    pathArr: string[];

    folderDialogRef: any;
    fileDialogRef: any;

    private location: string;
    private parentId: number;
    
    private _unsubscribeAll: Subject<any>;
    
    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog) {
            
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this._fileManagerService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
            this.selected = selected;
            
        });
        
        this._fileManagerService.onRouteParamsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(routeParams => {
                if (routeParams && routeParams.parentName) {
                    this.location = routeParams.parentName;
                    this.pathArr = this.location.split('>');
                }

                if (routeParams && routeParams.parentId) {
                    this.parentId = routeParams.parentId;
                }
            });
        
    }

    addFolder() {
        this.folderDialogRef = this._matDialog.open(FolderFormComponent, {
            panelClass: 'form-dialog',
            data: {
                parentId: this.parentId
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
                parentId: this.parentId
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

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
