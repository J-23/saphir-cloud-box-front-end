import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
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
import { AppsModule } from './main/apps/apps.module';
import { AuthenticationModule } from './main/authentication/authentication.module';
import { ConfirmMessageGuard } from './main/guards/confirm-message.guard';
import { ResetPasswordGuard } from './main/guards/reset-password.guard';

const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './main/authentication/authentication.module#AuthenticationModule'
    },
    {
        path      : '**',
        redirectTo: 'apps/auth/login'
    }
];

@NgModule({
    declarations: [
        AppComponent
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

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule,
        AppsModule,
        AuthenticationModule
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
        ConfirmMessageGuard,
        ResetPasswordGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HeaderInterceptor,
          multi: true
        }
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
