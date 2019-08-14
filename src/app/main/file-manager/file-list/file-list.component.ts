import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { AuthenticationService } from 'app/main/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector     : 'file-list',
    templateUrl  : './file-list.component.html',
    styleUrls    : ['./file-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerFileListComponent implements OnInit, OnDestroy {
    storages: any;

    private commonColumns = ['icon', 'name', 'modified', 'button'];
    private userColumns = ['icon', 'name', 'modified', 'access', 'button'];

    displayedColumns;
    selected: any;

    buttonRemoveIsAvailable: boolean = false;
    buttonUpdateIsAvailable: boolean = false;

    private _unsubscribeAll: Subject<any>;

    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private authenticationService: AuthenticationService,
        private router: Router) {
            
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this._fileManagerService.onFileStorageChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fileStorage => {
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
                            || (!fileStorage.client && fileStorage.owner && (user.role.name == 'DEPARTMENT HEAD' || user.role.name == 'EMPLOYEE'))) {
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
}
