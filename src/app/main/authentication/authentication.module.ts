import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MailConfirmComponent } from './mail-confirm/mail-confirm.component';
import { ConfirmMessageGuard } from '../guards/confirm-message.guard';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ResetPasswordGuard } from '../guards/reset-password.guard';

const routes = [
  {
      path: 'login',
      component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'mail-confirm',
    component: MailConfirmComponent,
    canActivate: [ConfirmMessageGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [ResetPasswordGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    FuseSharedModule,

    TranslateModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MailConfirmComponent
  ],
  providers: [
  ]
})
export class AuthenticationModule { }
