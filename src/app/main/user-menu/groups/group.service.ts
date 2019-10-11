import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Client } from 'app/main/models/client.model';
import { Group } from 'app/main/models/group.model';
import { reject } from 'q';
import { GroupsService } from './groups.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService implements Resolve<any> {

  private baseURL: string;

  group: Group;
  onGroupChanged: BehaviorSubject<Group>;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig,
    private groupsService: GroupsService,
    private fuseNavigationService: FuseNavigationService) {

    this.baseURL = this.appConfig['config']['URL'];

    this.onGroupChanged = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getGroup(route.params.id)])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getGroup(id): Promise<Group> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + `/api/user-group/${id}`)
        .subscribe((response: any) => {
          this.group = response;
          this.onGroupChanged.next(this.group);
          resolve(this.group);
        }, reject);
    });
  }

  add(group): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user-group/add', group)
        .subscribe((response: any) => {
          this.groupsService.getGroups();
        }, reject);
    })
  }

  update(group): Promise<any> {

    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user-group/update', group)
        .subscribe((response: any) => {
          this.groupsService.getGroups();
          this.getGroup(group.Id);
          
        }, reject);
    })
  }

  remove(group): Promise<any> {

    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user-group/remove', group)
        .subscribe(() => {
          this.fuseNavigationService.onGroupRemoveChanged.next(true);
          this.groupsService.getGroups();
        }, reject);
    })
  }
}
