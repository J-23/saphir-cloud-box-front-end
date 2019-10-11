import { NgModule } from '@angular/core';
import { GroupComponent } from './groups/group.component';
import { AuthorizedUserGuard } from '../guards/authorized-user.guard';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatToolbarModule, MatMenuModule, MatDatepickerModule, MatAutocompleteModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';
import { FuseConfirmDialogModule, FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { GroupService } from '../user-menu/groups/group.service';

const routes = [
  {
      path: 'group/:id',
      component: GroupComponent,
      canActivate: [AuthorizedUserGuard],
      resolve: {
        data: GroupService
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
    GroupComponent
  ],
  providers: [
    GroupService
  ]
})
export class UserMenuModule { }
