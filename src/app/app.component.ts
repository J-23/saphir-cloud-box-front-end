import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from 'app/navigation/i18n/en';
import { locale as german } from 'app/navigation/i18n/de';
import { locale as russian } from 'app/navigation/i18n/ru';
import { FileManagerService } from './main/file-manager/file-manager.service';
import { FolderNavigationService } from './navigation/folder-navigation.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FolderFormComponent } from './main/file-manager/folder-form/folder-form.component';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from './main/authentication/authentication.service';
import { FuseNavigationItem, FuseNavigation } from '@fuse/types';
import { RoleType } from './main/models/role.model';
import { navigation } from './navigation/navigation';
import { Router } from '@angular/router';
import { GroupService } from './main/user-menu/groups/group.service';
import { GroupsService } from './main/user-menu/groups/groups.service';
import { GroupFormComponent } from './main/user-menu/groups/group-form/group-form.component';
import { GroupComponent } from './main/user-menu/groups/group.component';

@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
    fuseConfig: any;
    
    navigation: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private folderNavigationService: FolderNavigationService,
        private _matDialog: MatDialog,
        private _fileManagerService: FileManagerService,
        private authenticationService: AuthenticationService,
        private groupsService: GroupsService,
        private groupService: GroupService,
        private translateService: TranslateService,
        private _matSnackBar: MatSnackBar,
        private router: Router
    )
    {
        this.setNavigation();

        // Get default navigation
        //this.navigation = navigation;

        // Register the navigation to the service
        //this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        //this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'de', 'ru']);

        // Set the default language
        this._translateService.setDefaultLang('de');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(english, german, russian);

        // Use a language
        const broserLang = navigator.language != null ? navigator.language : 'en';
        this._translateService.use(broserLang);  

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if ( this._platform.ANDROID || this._platform.IOS )
        {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this._fuseNavigationService.onButtonAddFolder
            .subscribe(isAddFolder => {
                if (isAddFolder) {
                    this.addFolder(1);
                }
            });

        this._fuseNavigationService.onButtonAddGroup
            .subscribe(isAddGroup => {
                if (isAddGroup) {
                    this.addGroup();
                }
            });
    }

    addFolder(parentId: number) {
        this.translateService.get('PAGES.APPS.FILEMANAGER.ADDFOLDER')
        .subscribe(message => {
            var folderDialogRef = this._matDialog.open(FolderFormComponent, {
                panelClass: 'file-form-dialog',
                data: {
                    parentId: parentId,
                    title: message
                }
            });

            folderDialogRef.afterClosed()
                .subscribe((form: FormGroup) => {
                
                if (form && form.valid) {
        
                var folder = {
                    parentId: form.controls['parentId'].value,
                    name: form.controls['name'].value
                };
        
                this._fileManagerService.addFolder(folder)
                    .then(() => { 
                        
                        this.folderNavigationService.getFolder()
                            .then()
                            .catch();
                    })
                    .catch(res => { });
                }
            });    
        });
        
    }

    addGroup() {
        var groupDialogRef = this._matDialog.open(GroupFormComponent, {
          panelClass: 'group-form-dialog',
          data: {
            dialogTitle: 'PAGES.APPS.USERGROUPS.ADD'
          }
        });
    
        groupDialogRef.afterClosed()
          .subscribe((form: FormGroup) => {
            if (form && form.valid) {
    
              var group = {
                Name: form.controls['name'].value,
                UserIds: form.controls['users'].value.map(user => user.id)
              };
    
              this.groupService.add(group)
                .then(() => {
                  
                  this.translateService.get('PAGES.APPS.USERGROUPS.ADDSUCCESS').subscribe(message => {
                    this.createSnackBar(message);
                  });
                  
                })
                .catch(res => {
                  if (res && res.status && res.status == 403) {
                    this.translateService.get('PAGES.APPS.USERGROUPS.' + res.error).subscribe(message => {
                      this.createSnackBar(message);
                    });
                  }
                  else if (res && res.status && res.status == 500) {
                    this.translateService.get('COMMONACTIONS.OOPS').subscribe(message => {
                      this.createSnackBar(message);
                    });
                  }
                });
            }
          });
    }

    
    createSnackBar(message: string) {
        this._matSnackBar.open(message, 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
    }

    setNavigation() {
 
        this._fuseNavigationService.register('main', navigation);
        this._fuseNavigationService.setCurrentNavigation('main');
       
        this.authenticationService.user$
            .subscribe(user => {

                this._fuseNavigationService.updateNavigationItem('applications', { hidden : true });
                this._fuseNavigationService.updateNavigationItem('advanced-search', { hidden : true });

                var itemChildren = this._fuseNavigationService.getNavigationItem('file-manager').children.filter(child => child.id == 'advanced-search');
                this._fuseNavigationService.updateNavigationItem('file-manager', { hidden : true, children: itemChildren });                

                this._fuseNavigationService.updateNavigationItem('user-menu', { hidden : true });
                this._fuseNavigationService.updateNavigationItem('user-group', { children: null });
                this._fuseNavigationService.updateNavigationItem('help', { hidden : true });

                if (user.id != undefined) {
                    
                    this._fuseNavigationService.updateNavigationItem('help', { hidden : false });

                    if (user.role.type == RoleType.SuperAdmin) {
                        this._fuseNavigationService.updateNavigationItem('applications', { hidden : false });
                    }

                    this.folderNavigationService.onNavigationChanged
                        .subscribe(folders => {

                            this._fuseNavigationService.updateNavigationItem('advanced-search', { hidden : false });
                            this._fuseNavigationService.updateNavigationItem('file-manager', { hidden : false });

                            if (user && user.role && (user.role.type == RoleType.SuperAdmin || user.role.type == RoleType.ClientAdmin)) {
                                    
                                this._fuseNavigationService.updateNavigationItem('file-manager', { button : {
                                    id: 'add-folder',
                                    title: 'Add Folder',
                                    icon: 'add'
                                }});
                            }

                            if (folders && folders.length > 0) {

                                const myFolder = folders.filter(item => item.title === 'My Folder');
                                folders = folders.filter(item => item.title !== 'My Folder');

                                var itemChildren = this._fuseNavigationService.getNavigationItem('file-manager').children.filter(child => child.id == 'advanced-search');

                                folders.forEach(fold => {
                                    itemChildren.push(fold);
                                });

                                this._fuseNavigationService.updateNavigationItem('file-manager', { children: itemChildren });

                                if (myFolder != null && myFolder.length === 1) {
                                    this._fileManagerService.getFileStorage(myFolder[0].id)
                                    .then(fileStorage => {
                                        // That doesn´t work. We need the folder structure from 'My Folder' under the navigation menu item 'my-file-manager'
                                        this._fuseNavigationService.updateNavigationItem('my-file-manager', { children: fileStorage.storages });
                                      });
                                }
                            }
                        }, () => { });
                }
            }, () => { });
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.groupsService.onGroupsChanged.subscribe(groups => {
            this._fuseNavigationService.updateNavigationItem('user-group', { children : null });

            var children = groups.map(group => {

                var item: FuseNavigationItem = {
                    id: group.id.toString(),
                    title: group.name,
                    type: 'item',
                    url: `/user-menu/group/${group.id}`
                };

                return item;
            });

            this._fuseNavigationService.updateNavigationItem('user-menu', { hidden: false });
            this._fuseNavigationService.updateNavigationItem('user-group', { children : children });
        });
        
        this._fuseNavigationService.onGroupRemoveChanged
            .subscribe(isRemoved => {

                if (isRemoved) {
                    var item = this._fuseNavigationService.getNavigationItem('user-group');

                    if (item.children.length > 1) {
                        var child = item.children[0];
                        this.router.navigate([child.url]);
                    }
                    else {
                        this.router.navigate(['/info/faq']);
                    }
                }
            });

        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if ( this.fuseConfig.layout.width === 'boxed' )
                {
                    this.document.body.classList.add('boxed');
                }
                else
                {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for ( let i = 0; i < this.document.body.classList.length; i++ )
                {
                    const className = this.document.body.classList[i];

                    if ( className.startsWith('theme-') )
                    {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
