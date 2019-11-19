import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationItem } from '@fuse/types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FolderNavigationService } from 'app/navigation/folder-navigation.service';

@Component({
    selector   : 'fuse-nav-vertical-group',
    templateUrl: './group.component.html',
    styleUrls  : ['./group.component.scss']
})
export class FuseNavVerticalGroupComponent implements OnInit, OnDestroy
{
    @HostBinding('class')
    classes = 'nav-group nav-item';

    @Input()
    item: FuseNavigationItem;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FolderNavigationService} _folderNavigationService
     * @param {TranslateService} _translationService
     */
    constructor(
        private router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _folderNavigationService: FolderNavigationService,
        private _translationService: TranslateService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
         .subscribe(() => {

             // Mark for check
             this._changeDetectorRef.markForCheck();
         });

         this._translationService.stream(this.item.translate).subscribe(
            text => {
                this.item.title = text;
            }
         );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    addGroupOrFolder(fuseNavigationItem: FuseNavigationItem) {
        if (fuseNavigationItem.button != null) {

            switch (fuseNavigationItem.button.id) {
                case 'add-folder': {
                    this._fuseNavigationService.onButtonAddFolder.next(true);
                    break;
                }
                case 'add-group': {
                    this._fuseNavigationService.onButtonAddGroup.next(true);
                }
            }
        }
    }

    showMyFolder() {
       this._folderNavigationService.getFolder()
       .then(folders => {
        const myFolder: FuseNavigationItem = folders.find(f => f.title === 'My Folder');

        if (myFolder != null) {
            this.router.navigateByUrl('file-manager/' + myFolder.id);
        }
       });
    }
}
