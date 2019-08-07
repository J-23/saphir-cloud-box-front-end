import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Error404Component } from './404/error-404.component';
import { MatIconModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { Error500Component } from './500/error-500.component';

const routes = [
  {
      path: 'error-404',
      component: Error404Component
  },
  {
    path: 'error-500',
    component: Error500Component
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    MatIconModule,
    
    FuseSharedModule
  ],
  declarations: [
    Error404Component,
    Error500Component
  ]
})
export class ErrorsModule { }