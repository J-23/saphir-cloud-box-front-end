import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { FileStorage } from 'app/main/models/file-storage.model';
import { FuseNavigationItem } from '@fuse/types';

@Injectable({
  providedIn: 'root'
})
export class FolderNavigationService {

  private baseURL: string;

  private rootId = 1;

  folders: FuseNavigationItem[] = [];
  onNavigationChanged: BehaviorSubject<FuseNavigationItem[]>;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.baseURL = this.appConfig['config']['URL'];

    this.onNavigationChanged = new BehaviorSubject([]);
  }

  getFolder(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + `/api/hierarchy/${this.rootId}`)
        .subscribe((folders: any[]) => {
          
          this._httpClient.get(this.baseURL + '/api/file-storage/shared-with-me')
            .subscribe((response: any) => {

              if (response.storages.length > 0) {

                folders.push({
                  id: 'shared-with-me',
                  name: 'Shared with me',
                  parentId: 1,
                  newFileCount: 0,
                  children: []
                });
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

  setFolders(folders: FuseNavigationItem[], children: any[], parentId): boolean {
    
    var isSetChildren = false;

    for (let folder of folders) {
      
      if (folder.id == parentId && !isSetChildren) {
        folder.children = children.map(fold => { 
          var item: FuseNavigationItem = {
            id: fold.id.toString(),
            title: fold.name,
            type: fold.isOpened ? 'collapsable' : 'item',
            url: `/file-manager/${fold.id}`,
            children: []
          };

          return item;
        });

        isSetChildren = true;
      }

      if (!isSetChildren) {
        isSetChildren = this.setFolders(folder.children, children, parentId);
      }
    }

    return isSetChildren;
  }
}
