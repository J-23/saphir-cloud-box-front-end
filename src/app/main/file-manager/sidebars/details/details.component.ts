import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';

@Component({
    selector   : 'file-manager-details-sidebar',
    templateUrl: './details.component.html',
    styleUrls  : ['./details.component.scss'],
    animations : fuseAnimations
})
export class FileManagerDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: any;

    private _unsubscribeAll: Subject<any>;

    constructor (private _fileManagerService: FileManagerService) {
        
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this._fileManagerService.onFileSelected
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
