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

const routes: Routes = [
    {
        path     : ':parentName/:parentId',
        component: FileManagerComponent,
        resolve  : {
            files: FileManagerService
        }
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
