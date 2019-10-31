import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { AppUser } from 'app/main/models/app-user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements Resolve<any> {

  users: AppUser[];
  onUsersChanged: BehaviorSubject<AppUser[]>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onUsersChanged = new BehaviorSubject([]);
    this.baseURL = this.appConfig['config']['URL'];
    }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getUsers()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getUsers(): Promise<AppUser[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/user/list')
          .subscribe((response: any[]) => {

            this.users = response.map(res => new AppUser(res));
            this.onUsersChanged.next(this.users);
            
            resolve(this.users);
          }, reject);
        });
  }

  getUsersForAdvancedSearch(): Promise<AppUser[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/advanced-search/users')
          .subscribe((response: any[]) => {
            resolve(response.map(res => new AppUser(res)));
          }, reject);
        });
  }

  addUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user/add', user)
        .subscribe(response => {
          this.getUsers();
          resolve(response);
        }, reject);
    });
  }

  updateUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user/update', user)
        .subscribe(response => {
          this.getUsers();
          resolve(response);
        }, reject);
    });
  }

  deleteUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user/remove', user)
        .subscribe(response => {
          this.getUsers();
          resolve(response);
        }, reject);
    });
  }
}
