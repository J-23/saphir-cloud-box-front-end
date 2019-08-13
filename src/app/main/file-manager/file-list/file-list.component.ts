import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';

@Component({
    selector     : 'file-list',
    templateUrl  : './file-list.component.html',
    styleUrls    : ['./file-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FileManagerFileListComponent implements OnInit, OnDestroy {
    files: any;
    dataSource: FilesDataSource | null;

    private commonColumns = ['icon', 'name', 'modified', 'button'];
    private userColumns = ['icon', 'name', 'modified', 'access', 'button'];

    displayedColumns;
    selected: any;

    private _unsubscribeAll: Subject<any>;

    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService) {
            
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._fileManagerService);

        this._fileManagerService.onFilesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(files => {
                console.log(files)
                this.files = files;
            });

        this._fileManagerService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });

        this.SetDisplayedColumns();
    }

    SetDisplayedColumns() {

        this._fileManagerService.onOwnerChanged
            .subscribe(ownerId => {

                console.log(ownerId)
                if (!ownerId) {
                    this.displayedColumns = this.commonColumns;
                }
                else {
                    this.displayedColumns = this.userColumns;
                }
            });
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSelect(selected): void {
        this._fileManagerService.onFileSelected.next(selected);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}

export class FilesDataSource extends DataSource<any> {

    constructor(private _fileManagerService: FileManagerService) {
        super();
    }

    connect(): Observable<any[]> {
        return this._fileManagerService.onFilesChanged;
    }

    disconnect(): void {
    }
}
