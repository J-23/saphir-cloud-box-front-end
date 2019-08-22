import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Storage } from 'app/main/models/file-storage.model';
import { AuthenticationService } from 'app/main/authentication/authentication.service';
import { RoleType } from 'app/main/models/role.model';

@Component({
    selector   : 'file-manager-details-sidebar',
    templateUrl: './details.component.html',
    styleUrls  : ['./details.component.scss'],
    animations : fuseAnimations
})
export class FileManagerDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: Storage;

    private _unsubscribeAll: Subject<any>;

    constructor (private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private authenticationService: AuthenticationService) {
        
        this._unsubscribeAll = new Subject();
    }

    buttonRemoveIsAvailable:boolean;
    buttonUpdateIsAvailable: boolean;
    permissionsAreDisabled: boolean = true;

    ngOnInit(): void {

        this._fileManagerService.onStorageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;

                if ( this.selected) {
                    this.authenticationService.user$
                        .subscribe(user => {
                            if ((!this.selected.client && !this.selected.owner && user.role.type == RoleType.SuperAdmin)
                                || (this.selected.client && !this.selected.owner && user.role.type == RoleType.ClientAdmin)
                                || (!this.selected.client && this.selected.owner && (user.role.type == RoleType.DepartmentHead || user.role.type == RoleType.Employee
                                || user.id == this.selected.owner.id))) {
                                this.buttonRemoveIsAvailable = true;
                                this.buttonUpdateIsAvailable = true;
                                this.permissionsAreDisabled = false;
                            }
                            else {
                                this.buttonRemoveIsAvailable = false;
                                this.buttonUpdateIsAvailable = false;
                                this.permissionsAreDisabled = true;
                            }
                        });
                }
            });
    }

    close() {
        this._fuseSidebarService.getSidebar('file-manager-details-sidebar').toggleOpen();
    }

    ngOnDestroy(): void {
        
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
