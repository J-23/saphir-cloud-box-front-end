import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from 'app/app.config';

@Injectable()
export class FileManagerService implements Resolve<any> {
    
    onFileStorageChanged: BehaviorSubject<any>;
    onStorageSelected: BehaviorSubject<any>;

    private baseURL: string;

    constructor (private _httpClient: HttpClient,
        private appConfig: AppConfig) {
        
        this.onFileStorageChanged = new BehaviorSubject({});
        this.onStorageSelected = new BehaviorSubject(null);

        this.baseURL = this.appConfig['config']['URL'];
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise((resolve, reject) => {

            if (route.params && route.params.id) {

            }
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

    getFileStorage(id): Promise<any> {

        return new Promise((resolve, reject) => {

            this._httpClient.get(this.baseURL + `/api/file-storage/${id}`)
                .subscribe((fileStorage: any) => {
                    this.onFileStorageChanged.next(fileStorage);

                    resolve(fileStorage);
                }, reject);
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

    addFile(file): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/add/file', file)
                .subscribe((response:any) => {

                    this.getFileStorage(file.parentId);
                    resolve(response);
                }, reject);
        })
    }
}
