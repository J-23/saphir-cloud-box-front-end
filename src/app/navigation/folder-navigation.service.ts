import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { FileStorage } from 'app/main/models/file-storage.model';

@Injectable({
  providedIn: 'root'
})
export class FolderNavigationService {

  private baseURL: string;

  onNavigationChanged: BehaviorSubject<FileStorage>;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.baseURL = this.appConfig['config']['URL'];

    this.onNavigationChanged = new BehaviorSubject(null);
  }

  getFolder(parentId: number): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + `/api/file-storage/${parentId}`)
        .subscribe((fileStorage: any) => {
          
          this._httpClient.get(this.baseURL + '/api/file-storage/shared-with-me')
            .subscribe((response: any) => {

              if (response.storages.length > 0) {

                fileStorage.storages.push({
                  id: 'shared-with-me',
                  name: 'Shared with me',
                  isDirectory: true,
                  createBy: null,
                  createDate: new Date(),
                  updateBy: null,
                  updateDate: new Date(),
                  owner: null,
                  client: null,
                  storageType: 'folder',
                  file: null,
                  permissions: [],
                  isAvailableToUpdate: false,
                  isAvailablaToAddPermision: false,
                  newFileCount: response.newFileCount
                });
              }

              this.onNavigationChanged.next(fileStorage);
              resolve(fileStorage);
            }, reject);
        }, reject);
      });
  }
}
