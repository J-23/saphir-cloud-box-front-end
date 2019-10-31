import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { FuseNavigationItem } from '@fuse/types';
import { Group } from 'app/main/models/group.model';

@Injectable({
  providedIn: 'root'
})
export class FolderNavigationService {

  private baseURL: string;

  private rootId = 1;

  folders: FuseNavigationItem[] = [];
  groups: Group[] = [];

  onNavigationChanged: BehaviorSubject<FuseNavigationItem[]>;
  onUserGroupsChanged: BehaviorSubject<Group[]>;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.baseURL = this.appConfig['config']['URL'];

    this.onNavigationChanged = new BehaviorSubject([]);
    this.onUserGroupsChanged = new BehaviorSubject([]);
  }

  getFolder(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + `/api/hierarchy/${this.rootId}`)
        .subscribe((folders: any[]) => {
          
          this._httpClient.get(this.baseURL + '/api/file-storage/shared-with-me')
            .subscribe((response: any) => {

              if (response.storages.length > 0) {

                var sharedWithMeFolder = folders.find(fold => fold.id == 'shared-with-me');

                if (sharedWithMeFolder == null) {
                  folders.push({
                    id: 'shared-with-me',
                    name: 'Shared with me',
                    parentId: 1,
                    newFileCount: response.newFileCount,
                    children: []
                  });
                }
                else {
                  sharedWithMeFolder.newFileCount = response.newFileCount;
                }
              }

              this.folders = this.map(folders);
              this.onNavigationChanged.next(this.folders);
              resolve(this.folders);
            }, reject);
          }, reject);
      });
  }

  map(folders: any[]): FuseNavigationItem[]{

    var result: FuseNavigationItem[] = [];
    
    for (let folder of folders) {
      var object: FuseNavigationItem = {
        id: folder.id.toString(),
        title: folder.name,
        type: folder.children.length > 0 ? 'collapsable' : 'item',
        url: `/file-manager/${folder.id}`,
        children: this.map(folder.children),
        badge: folder.newFileCount > 0 ? {
          title: folder.newFileCount.toString(),
          bg: '#4DB6AC',
          fg: '#FFFFFF'
        } : null
      }

      result.push(object);
    }

    return result;
  }
}
