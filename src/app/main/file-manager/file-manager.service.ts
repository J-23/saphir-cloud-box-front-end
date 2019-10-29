import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { FileStorage, Storage } from '../models/file-storage.model';
import 'rxjs/add/operator/map';
import { reject } from 'q';

@Injectable()
export class FileManagerService implements Resolve<any> {
    
    private navigations: any[] = [];
    onFileStorageChanged: BehaviorSubject<FileStorage>;
    onStorageSelected: BehaviorSubject<Storage>;

    onNavigationChanged: BehaviorSubject<any[]>;

    onFilterChanged: BehaviorSubject<any>;

    private baseURL: string;

    storages: Storage[] = [];

    constructor (private _httpClient: HttpClient,
        private appConfig: AppConfig) {
        
        this.onFileStorageChanged = new BehaviorSubject(null);
        this.onStorageSelected = new BehaviorSubject(null);
        this.onNavigationChanged = new BehaviorSubject([]);
        this.onFilterChanged = new BehaviorSubject(null);
        
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
                    .subscribe((response: any) => {

                        var fileStorage: FileStorage = {
                            owner: null,
                            client: null,
                            parentStorageId: 1,
                            id: 'shared-with-me',
                            name: 'Shared with me',
                            permissions: [],
                            storages: response.storages
                        };

                        var nav = this.navigations.pop();

                        if (nav && nav.id != 'shared-with-me') {
                            this.navigations.push(nav);
                        }

                        this.navigations.push({
                            id: 'shared-with-me',
                            name: 'Shared with me'
                        });

                        this.onNavigationChanged.next(this.navigations);

                        this.onFileStorageChanged.next(fileStorage);
                        this.onStorageSelected.next(fileStorage.storages[0]);

                        this.storages = fileStorage.storages;

                        resolve(fileStorage);
                    }, reject);
            }
            else {
                this._httpClient.get(this.baseURL + `/api/file-storage/${id}`)
                    .subscribe((fileStorage: any) => {

                        var nav = this.navigations.pop();

                        if (nav && nav.id != id) {
                            this.navigations.push(nav);
                        }

                        this.navigations.push({
                            id: id,
                            name: fileStorage.name
                        });
                        this.onNavigationChanged.next(this.navigations);

                        this.onFileStorageChanged.next(fileStorage);
                        this.onStorageSelected.next(fileStorage.storages[0]);

                        this.storages = fileStorage.storages;
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

    downloadFile(fileId): Observable<any> {
        
        return this._httpClient.get(this.baseURL + `/api/file-storage/download/file/${fileId}`, { responseType: 'blob' })
                .map((response) => {
                    return response;
                });
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

    checkPermission(permission, parentId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/check/permission', permission)
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

    viewFile(file, parentId): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/view', file)
                .subscribe((response:any) => {

                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    cancelFileView(file, parentId): Promise<any> {

        return new Promise((resolve, reject) => {

            this._httpClient.post(this.baseURL + '/api/file-storage/cancel-view', file)
                .subscribe((response: any) => {
                    this.getFileStorage(parentId);
                    resolve(response);
                }, reject);
        });
    }

    getParent(childId) : Promise<any> {

        return new Promise((resolve, reject) => {

            this._httpClient.get(this.baseURL + `/api/hierarchy/by-child/${childId}`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
