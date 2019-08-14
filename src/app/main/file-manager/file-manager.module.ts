import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatIconModule, MatRippleModule, MatSlideToggleModule, MatTableModule, MatToolbarModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatMenuModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { FileManagerComponent } from 'app/main/file-manager/file-manager.component';
import { FileManagerDetailsSidebarComponent } from 'app/main/file-manager/sidebars/details/details.component';
import { FileManagerFileListComponent } from 'app/main/file-manager/file-list/file-list.component';
import { FolderFormComponent } from './folder-form/folder-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { FileFormComponent } from './file-form/file-form.component';
import { AuthorizedUserGuard } from '../guards/authorized-user.guard';

const routes: Routes = [
    {
        path     : ':id',
        component: FileManagerComponent,
        resolve  : {
            files: FileManagerService
        },
        canActivate: [AuthorizedUserGuard]
    }
];

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerFileListComponent,
        FileManagerDetailsSidebarComponent,
        FileFormComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatSlideToggleModule,
        MatTableModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatMenuModule,
        
        FuseSharedModule,
        FuseSidebarModule,

        TranslateModule
    ],
    providers   : [
        FileManagerService
    ],
    entryComponents: [
        FileFormComponent
    ]
})
export class FileManagerModule
{
}
