import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { Storage } from '../../models/file-storage.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService implements Resolve<any>  {
  
  private EMPTY_SEARCH = {
    ClientIds: [],
    DepartmentIds: [],
    UserIds: [],
    UserGroupIds: [],
    FolderIds: [],
    StartDate: null,
    EndDate: null,
    SearchString: null
  };

  private baseURL: string;

  storages: Storage[] = [];
  onStoragesChange: BehaviorSubject<Storage[]>;
  
  onSearchChanged: BehaviorSubject<any>;
  
  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 

    this.baseURL = this.appConfig['config']['URL'];

    this.onStoragesChange = new BehaviorSubject([]);

    this.onSearchChanged = new BehaviorSubject(this.EMPTY_SEARCH);
  }
  
  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot) {
    
    var search = {
      ClientIds: this.onSearchChanged.value.clients ? this.onSearchChanged.value.clients.map(client => client.id) : [],
      DepartmentIds: this.onSearchChanged.value.departments ? this.onSearchChanged.value.departments.map(department => department.id): [],
      UserIds: this.onSearchChanged.value.users ? this.onSearchChanged.value.users.map(user => user.id): [],
      UserGroupIds: this.onSearchChanged.value.userGroups ? this.onSearchChanged.value.userGroups.map(group => group.id): [],
      FolderIds: this.onSearchChanged.value.folders ? this.onSearchChanged.value.folders.map(folder => folder.id): [],
      StartDate: this.onSearchChanged.value.startDate,
      EndDate: this.onSearchChanged.value.endDate,
      SearchString: this.onSearchChanged.value.searchString
    };

    return new Promise((resolve, reject) => {
      Promise.all([this.search(search)])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  search(search): Promise<Storage[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/advanced-search/get', search)
        .subscribe((response: any) => {
          this.storages = response;
          this.onStoragesChange.next(this.storages);
          resolve(this.storages);
        }, reject);
    });
  }

  getParentByChildId(childId) : Promise<any> {

    return new Promise((resolve, reject) => {

        this._httpClient.get(this.baseURL + `/api/advanced-search/storage/${childId}`)
            .subscribe((response: any) => {
                resolve(response);
            }, reject);
    });
  }
}
