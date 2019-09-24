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
import { MatDialog } from '@angular/material';
import { FolderFormComponent } from './main/file-manager/folder-form/folder-form.component';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from './main/authentication/authentication.service';
import { FuseNavigationItem, FuseNavigation } from '@fuse/types';
import { RoleType } from './main/models/role.model';
import { appNavigation, helpNavigation, userNavigation } from './navigation/navigation';

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
        private authenticationService: AuthenticationService
    )
    {

        this.navigation = [];
        this._fuseNavigationService.register('main', this.navigation);
        this._fuseNavigationService.setCurrentNavigation('main');
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
        this._translateService.use('de');

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
    }

    addFolder(parentId: number) {
        var folderDialogRef = this._matDialog.open(FolderFormComponent, {
            panelClass: 'form-dialog',
            data: {
                parentId: parentId
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
                    
                    this.folderNavigationService.getFolder(1)
                        .then()
                        .catch();
                })
                .catch(res => { });
            }
          });
    }

    setNavigation() {

        this.authenticationService.user$
            .subscribe(user => {

                if (user.id != undefined) {
     
                    if (user.role.type == RoleType.SuperAdmin) {
                        this.navigation.push(appNavigation);
                    }
                    else {
                        this.navigation = this.navigation.filter(nav => !(nav.id == 'applications'));
                    }

                    this.navigation.push(userNavigation);

                    this.folderNavigationService.onNavigationChanged
                        .subscribe(fileStorage => {

                            if (fileStorage) {
                                var children: FuseNavigationItem[] = fileStorage.storages.map(folder => {
                                    if (folder.isDirectory) {
                                        var child: FuseNavigationItem = { 
                                            id: folder.id.toString(),
                                            title: folder.name,
                                            type: 'item',
                                            url: `/file-manager/${folder.id}`
                                        };

                                        if (folder.newFileCount > 0) {
                                            child.badge = {
                                                title: folder.newFileCount.toString(),
                                                bg: '#4DB6AC',
                                                fg: '#FFFFFF'
                                            }
                                        }

                                        return child;
                                    }
                                });   
                                
                                var fileManagerNavigation: FuseNavigation = {
                                    id: 'file-manager',
                                    title: 'File Manager',
                                    type: 'group',
                                    children: children
                                };

                                if (user && user.role && (user.role.type == RoleType.SuperAdmin || user.role.type == RoleType.ClientAdmin)) {
                                    fileManagerNavigation['button'] = {
                                        id: 'add-folder',
                                        title: 'Add Folder',
                                        icon: 'add'
                                    }
                                }

                                this.navigation = this.navigation.filter(nav => !(nav.id == 'file-manager'));
                                this.navigation.push(fileManagerNavigation);
                                
                                this.navigation = this.navigation.filter(nav => !(nav.id == 'help'));
                                this.navigation.push(helpNavigation);

                                this._fuseNavigationService.unregister('main');
                                this._fuseNavigationService.register('main', this.navigation);
                                this._fuseNavigationService.setCurrentNavigation('main');
                            }
                            else {

                                this.folderNavigationService.getFolder(1);
                                
                                this.navigation = this.navigation.filter(nav => !(nav.id == 'file-manager'));

                                this._fuseNavigationService.unregister('main');
                                this._fuseNavigationService.register('main', this.navigation);
                                this._fuseNavigationService.setCurrentNavigation('main');
                            }
                        }, () => { });    
                }
                else {
                    this.navigation = this.navigation.filter(nav => !(nav.id == 'applications'));
                    this.navigation = this.navigation.filter(nav => !(nav.id == 'user-menu'));

                    this._fuseNavigationService.unregister('main');
                    this._fuseNavigationService.register('main', this.navigation);
                    this._fuseNavigationService.setCurrentNavigation('main');
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
