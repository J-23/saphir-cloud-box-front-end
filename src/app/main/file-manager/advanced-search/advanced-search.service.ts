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
    UserGroupIds: []
  };

  private baseURL: string;

  storages: Storage[] = [];
  onStoragesChange: BehaviorSubject<Storage[]>;
  
  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 

    this.baseURL = this.appConfig['config']['URL'];

    this.onStoragesChange = new BehaviorSubject([]);
  }
  
  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot) {
    
    return new Promise((resolve, reject) => {
      Promise.all([this.search(this.EMPTY_SEARCH)])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  search(search): Promise<Storage[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/file-storage/advanced-search', search)
        .subscribe((response: any) => {
          this.storages = response;
          this.onStoragesChange.next(this.storages);
          resolve(this.storages);
        }, reject);
    });
  }
}
