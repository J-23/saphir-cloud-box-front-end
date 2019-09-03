import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Client } from 'app/main/models/client.model';
import { Group } from 'app/main/models/group.model';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class GroupsService implements Resolve<any> {

  private baseURL: string;

  groups: Group[] = [];
  onGroupsChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) {

    this.baseURL = this.appConfig['config']['URL'];

    this.onGroupsChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getGroups()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getGroups(): Promise<Group[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/user-group/list')
        .subscribe((response: any) => {
          this.groups = response;
          this.onGroupsChanged.next(this.groups);
          resolve(this.groups);
        }, reject);
    });
  }

  add(group): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user-group/add', group)
        .subscribe((response: any) => {
          this.getGroups();
        }, reject);
    })
  }

  update(group): Promise<any> {

    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user-group/update', group)
        .subscribe((response: any) => {
          this.getGroups();
        }, reject);
    })
  }

  remove(group): Promise<any> {

    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user-group/remove', group)
        .subscribe((response: any) => {
          this.getGroups();
        }, reject);
    })
  }
}
