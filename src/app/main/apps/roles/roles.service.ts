import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { Role } from 'app/main/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService implements Resolve<any> {

  roles: Role[];
  onRolesChanged: BehaviorSubject<Role[]>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onRolesChanged = new BehaviorSubject([]);
    this.baseURL = this.appConfig['config']['URL'];
    }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getRoles()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getRoles(): Promise<Role[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/role/list')
          .subscribe((response: any[]) => {

            this.roles = response.map(res => new Role(res));
            this.onRolesChanged.next(this.roles);
            
            resolve(this.roles);
          }, reject);
        });
  }

  addRole(role): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/role/add', role)
        .subscribe(response => {
          this.getRoles();
          resolve(response);
        }, reject);
    });
  }

  updateRole(role): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/role/update', role)
        .subscribe(response => {
          this.getRoles();
          resolve(response);
        }, reject);
    });
  }

  deleteRole(role): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/role/remove', role)
        .subscribe(response => {
          this.getRoles();
          resolve(response);
        }, reject);
    });
  }
}
