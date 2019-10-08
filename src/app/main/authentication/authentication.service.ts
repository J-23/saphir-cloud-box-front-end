import { Injectable } from '@angular/core';
import { shareReplay, filter, tap, map, last } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { AppConfig } from 'app/app.config';
import { FolderNavigationService } from 'app/navigation/folder-navigation.service';

export const ANONYMOUS_USER: AppUser = {
    id: undefined,
    userName: undefined,
    email: undefined,
    client: undefined,
    department: undefined,
    role: undefined,
    createDate: undefined
  }

@Injectable()
export class AuthenticationService {

    private userSubject = new BehaviorSubject<AppUser>(undefined);
    user$: Observable<AppUser> = this.userSubject.asObservable().pipe(filter(user => !!user));
    isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.id));

    userEmail = new BehaviorSubject<string>(undefined);

    private baseURL: string;

    constructor(private _httpClient: HttpClient,
        private appConfig: AppConfig,
        private folderNavigationService: FolderNavigationService) { 
            
        this.baseURL = this.appConfig['config']['URL'];

        this.getUser();
    }

    login(email: string, password: string) : Promise<any> {
        
        var body = {
            Email: email,
            Password: password
        };

        return new Promise((resolve, reject) => {
            return this._httpClient.post(this.baseURL + '/api/account/login', body)
                .subscribe((response: any) => { 
                    
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem('refresh_token', response.refresh_token);
                    localStorage.setItem('expires_date', response.expires_date);

                    this.getUser().then(user => {
                        resolve(user);
                    })
                    .catch(() => reject);

                }, reject);
        });
    }

    register(userName: string, email: string, clientId: number, password: string, passwordConfirm: string,
        departmentId?: number): Promise<any> {
        
        var body = {
            UserName: userName,
            Email: email,
            Password: password,
            PasswordConfirmed: passwordConfirm,
            ClientId: clientId,
            DepartmentId: departmentId
        };

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/account/register', body)
                .subscribe((response: any) => {
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem('refresh_token', response.refresh_token);
                    localStorage.setItem('expires_date', response.expires_date);

                    this.getUser().then(user => {
                        resolve(user);
                    })
                    .catch(() => reject);
                }, reject);
        });
    }

    forgotPassword(email: string): Promise<any> {
        var body = {
            Email: email
        };

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + "/api/account/forgot-password", body)
                .subscribe((response: any)=> {
                    resolve();
                }, reject);
        })
    }

    resetPassword(email: string, password: string, passwordConfirm: string, code: string): Promise<any> {
        var body = {
            Email: email,
            Password: password,
            PasswordConfirm: passwordConfirm,
            Code: code
        };

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + "/api/account/reset-password", body)
                .subscribe(() => {
                    
                    this.userEmail.next(undefined);
                    resolve()
                }, reject);
        })
    }

    getUser(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.baseURL + '/api/account/user')
                .subscribe(response => {
                    if (response) {
                        var user = new AppUser(response);

                        this.userSubject.next(user);

                        this.folderNavigationService.getFolder()
                            .then()
                            .catch();

                        this.folderNavigationService.getGroups()
                            .then()
                            .catch();
                            
                        resolve(user);
                    }
                    else {
                        this.userSubject.next(ANONYMOUS_USER);
                    }
                }, err => {
                    this.userSubject.next(ANONYMOUS_USER);
                    reject;
                })
        });
        
    }

    logout() {

        this.userSubject.next(ANONYMOUS_USER);
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_date');
    }
}