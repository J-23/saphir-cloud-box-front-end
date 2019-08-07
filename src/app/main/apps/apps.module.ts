import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, 
    MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, 
    MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, 
    MatMenuModule, MatToolbarModule, MatDatepickerModule, MatRadioModule, MatStepperModule, 
    MatAutocompleteModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSidebarModule, FuseConfirmDialogModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorizedUserGuard } from '../guards/authorized-user.guard';

@NgModule({
    imports     : [
        FuseSharedModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatMenuModule,
        MatRadioModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatStepperModule,
        MatAutocompleteModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseWidgetModule,
        FuseSidebarModule,

        TranslateModule
    ],
    declarations: [
    ],
    providers: [
    ],
    entryComponents: [
    ]
})
export class AppsModule
{
}
