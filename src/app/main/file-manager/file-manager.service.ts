import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from 'app/app.config';

@Injectable()
export class FileManagerService implements Resolve<any> {
    
    onRouteParamsChanged: BehaviorSubject<any>;

    onFilesChanged: BehaviorSubject<any>;
    onFileSelected: BehaviorSubject<any>;

    private baseURL: string;

    constructor (private _httpClient: HttpClient,
        private appConfig: AppConfig) {
        
        this.onFilesChanged = new BehaviorSubject({});
        this.onFileSelected = new BehaviorSubject({});
        this.onRouteParamsChanged = new BehaviorSubject({});

        this.baseURL = this.appConfig['config']['URL'];
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        this.onRouteParamsChanged.next(route.params);

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getFiles()
            ]).then(
                ([files]) => {
                    resolve();
                },
                reject
            );
        });
    }

    getFiles(): Promise<any> {

        return new Promise((resolve, reject) => {

            this.onRouteParamsChanged.subscribe(routeParams => {
                if (routeParams && routeParams.parentId) {
                    this._httpClient.get(this.baseURL + `/api/file-storage/${routeParams.parentId}`)
                    .subscribe((response: any) => {
                        this.onFilesChanged.next(response);
                        this.onFileSelected.next(response[0]);
                        resolve(response);
                    }, reject);
                }
                else {
                    reject;
                }
            }, reject);
            
        });
    }

    addFolder(folder): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/add/folder', folder)
                .subscribe((response:any) => {

                    this.getFiles();
                    resolve(response);
                }, reject);
        });
    }

    addFile(file): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/file-storage/add/file', file)
                .subscribe((response:any) => {

                    this.getFiles();
                    resolve(response);
                }, reject);
        })
    }
}
