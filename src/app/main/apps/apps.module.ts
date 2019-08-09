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
import { ClientsComponent } from './clients/clients.component';
import { DepartmentsComponent } from './departments/departments.component';
import { UsersComponent } from './users/users.component';
import { ClientsService } from './clients/clients.service';
import { ConfirmFormComponent } from './confirm-form/confirm-form.component';
import { ClientFormComponent } from './clients/client-form/client-form.component';
import { DepartmentsService } from './departments/departments.service';
import { DepartmentFormComponent } from './departments/department-form/department-form.component';
import { RolesComponent } from './roles/roles.component';
import { RolesService } from './roles/roles.service';
import { RoleFormComponent } from './roles/role-form/role-form.component';
import { UsersService } from './users/users.service';
import { UserFormComponent } from './users/user-form/user-form.component';

const routes = [
    {
        path: 'clients',
        component: ClientsComponent,
        resolve  : {
            data: ClientsService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path: 'departments',
        component: DepartmentsComponent,
        resolve  : {
            data: DepartmentsService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path: 'roles',
        component: RolesComponent,
        resolve  : {
            data: RolesService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        resolve  : {
            data: UsersService
        },
        canActivate: [AuthorizedUserGuard]
    },
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
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
        ClientsComponent,
        DepartmentsComponent,
        UsersComponent,
        ClientFormComponent,
        ConfirmFormComponent,
        DepartmentFormComponent,
        RolesComponent,
        RoleFormComponent,
        UserFormComponent
    ],
    providers: [
        ClientsService,
        DepartmentsService,
        RolesService,
        UsersService
    ],
    entryComponents: [
        ClientFormComponent,
        ConfirmFormComponent,
        DepartmentFormComponent,
        RoleFormComponent,
        UserFormComponent
    ]
})
export class AppsModule
{
}
