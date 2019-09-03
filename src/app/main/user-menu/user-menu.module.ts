import { NgModule } from '@angular/core';
import { GroupsComponent } from './groups/groups.component';
import { AuthorizedUserGuard } from '../guards/authorized-user.guard';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatToolbarModule, MatMenuModule, MatDatepickerModule, MatAutocompleteModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';
import { FuseConfirmDialogModule, FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { GroupsService } from './groups/groups.service';
import { GroupFormComponent } from './groups/group-form/group-form.component';

const routes = [
  {
      path: 'groups',
      component: GroupsComponent,
      canActivate: [AuthorizedUserGuard],
      resolve: {
        data: GroupsService
      }
  }
];

@NgModule({
  imports: [
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
    MatMenuModule,
    MatToolbarModule,
    MatDatepickerModule,
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
    GroupsComponent,
    GroupFormComponent
  ],
  providers: [
    GroupsService
  ],
  entryComponents: [
    GroupFormComponent
  ]
})
export class UserMenuModule { }
