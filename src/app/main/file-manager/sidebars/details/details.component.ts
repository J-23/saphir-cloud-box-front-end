import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Storage } from 'app/main/models/file-storage.model';

@Component({
    selector   : 'file-manager-details-sidebar',
    templateUrl: './details.component.html',
    styleUrls  : ['./details.component.scss'],
    animations : fuseAnimations
})
export class FileManagerDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: Storage;

    private _unsubscribeAll: Subject<any>;

    constructor (private _fileManagerService: FileManagerService) {
        
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this._fileManagerService.onStorageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
