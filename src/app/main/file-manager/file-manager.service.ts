import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { FileStorage, Storage } from '../models/file-storage.model';

@Injectable()
export class FileManagerService implements Resolve<any> {
    
    private navigations: any[] = [];
    onFileStorageChanged: BehaviorSubject<FileStorage>;
    onStorageSelected: BehaviorSubject<Storage>;

    onNavigationChanged: BehaviorSubject<any[]>;

    private baseURL: string;

    constructor (private _httpClient: HttpClient,
        private appConfig: AppConfig) {
        
        this.onFileStorageChanged = new BehaviorSubject(null);
        this.onStorageSelected = new BehaviorSubject(null);
        this.onNavigationChanged = new BehaviorSubject([]);

        this.baseURL = this.appConfig['config']['URL'];
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getFileStorage(route.params.id)
            ]).then(
                ([files]) => {
                    resolve();
                },
                reject
            );
        });
    }

    getFileStorage(id): Promise<FileStorage> {

        return new Promise((resolve, reject) => {

            if (id == 'shared-with-me') {
                this._httpClient.get(this.baseURL + '/api/file-storage/shared-with-me')
                    .subscribe((storages: any) => {

                        var fileStorage: FileStorage = {
                            owner: null,
                            client: null,
                            parentStorageId: 1,
                            id: 'shared-with-me',
                            name: 'Shared with me',
                            permissions: [],
                            storages: storages
                        };

                        this.navigations.push({
                            id: 'shared-with-me',
                            name: 'Shared with me'
                        });

                        this.onNavigationChanged.next(this.navigations);

                        this.onFileStorageChanged.next(fileStorage);
                        this.onStorageSelected.next(fileStorage.storages[0]);
                        resolve(fileStorage);
                    }, reject);
            }
            else {
                this._httpClient.get(this.baseURL + `/api/file-storage/${id}`)
                    .subscribe((fileStorage: any) => {

                        this.navigations.push({
                            id: id,
                            name: fileStorage.name
                        });
                        this.onNavigationChanged.next(this.navigations);

                        this.onFileStorageChanged.next(fileStorage);
                        this.onStorageSelected.next(fileStorage.storages[0]);
                        resolve(fileStorage);
                    }, reject);
            }
        });
    }

    addFolder(folder): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/add/folder', folder)
                .subscribe((response:any) => {

                    this.getFileStorage(folder.parentId);
                    resolve(response);
                }, reject);
        });
    }

    updateFolder(folder, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/update/folder', folder)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    removeFolder(folder, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/remove/folder', folder)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    addFile(file): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/add/file', file)
                .subscribe((response:any) => {

                    this.getFileStorage(file.parentId);
                    resolve(response);
                }, reject);
        });
    }

    downloadFile(fileId, owner, client) {
        var ownerId = owner ? owner.id : 0;
        var clientId = client ? client.id : 0;
        
        window.open(this.baseURL + `/api/file-storage/download/file/${fileId}/${ownerId}/${clientId}`);
    }

    updateFile(file, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/update/file', file)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    removeFile(file, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/remove/file', file)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    addPermission(permission, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/add/permission', permission)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    updatePermission(permission, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/update/permission', permission)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    removePermission(permission, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/remove/permission', permission)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }
}
