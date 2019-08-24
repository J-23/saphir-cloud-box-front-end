import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help/help.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AuthorizedUserGuard } from '../guards/authorized-user.guard';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatExpansionModule } from '@angular/material';

const routes = [
  {
      path: 'feedback',
      component: FeedbackComponent,
      canActivate: [AuthorizedUserGuard]
  },
  {
      path: 'faq',
      component: HelpComponent,
      canActivate: [AuthorizedUserGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    FuseSharedModule,
    FuseSidebarModule,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatExpansionModule,

    TranslateModule
  ],
  declarations: [
    HelpComponent,
    FeedbackComponent
  ]
})
export class InfoModule { }
