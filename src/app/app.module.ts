import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatDialogModule, MatToolbarModule, MatInputModule, MatSnackBarModule, MatSelectModule } from '@angular/material';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
import { AppConfig } from './app.config';
import { HttpModule } from '@angular/http';
import { AuthorizedUserGuard } from './main/guards/authorized-user.guard';
import { AuthenticationService } from './main/authentication/authentication.service';
import { HeaderInterceptor } from './main/interceptors/header.interceptor';
import { ConfirmMessageGuard } from './main/guards/confirm-message.guard';
import { ResetPasswordGuard } from './main/guards/reset-password.guard';
import { FolderNavigationService } from './navigation/folder-navigation.service';
import { FileManagerService } from './main/file-manager/file-manager.service';
import { FolderFormComponent } from './main/file-manager/folder-form/folder-form.component';
import { ConfirmFormComponent } from './main/confirm-form/confirm-form.component';
import { AuthorizedAndAdminUserGuard } from './main/guards/authorized-and-admin-user.guard';
import { GroupFormComponent } from './main/user-menu/groups/group-form/group-form.component';

const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './main/authentication/authentication.module#AuthenticationModule'
    },
    {
        path: 'errors',
        loadChildren: './main/errors/errors.module#ErrorsModule',
        canActivate: [AuthorizedUserGuard]
    },
    {
        path: 'apps',
        loadChildren: './main/apps/apps.module#AppsModule',
        canActivate: [AuthorizedAndAdminUserGuard]
    },
    {
        path: 'user-menu',
        loadChildren: './main/user-menu/user-menu.module#UserMenuModule',
        canActivate: [AuthorizedUserGuard]
    },
    {
        path: 'info',
        loadChildren: './main/info/info.module#InfoModule',
        canActivate: [AuthorizedUserGuard]
    },
    {
        path: 'file-manager',
        loadChildren: './main/file-manager/file-manager.module#FileManagerModule',
        canActivate: [AuthorizedUserGuard]
    },
    {
        path      : '',
        redirectTo: '/apps/clients',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        FolderFormComponent,
        ConfirmFormComponent,
        GroupFormComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,
        
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule
    ],
    providers: [
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: (config: AppConfig) => () => config.load(),
            deps: [
                AppConfig
            ],
            multi: true
        },
        AuthenticationService,
        AuthorizedUserGuard,
        AuthorizedAndAdminUserGuard,
        ConfirmMessageGuard,
        ResetPasswordGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HeaderInterceptor,
          multi: true
        },
        FolderNavigationService,
        FileManagerService
    ],
    bootstrap   : [
        AppComponent
    ],
    entryComponents: [
        FolderFormComponent,
        GroupFormComponent,
        ConfirmFormComponent
    ]
})
export class AppModule
{
}
