import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { Department } from 'app/main/models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService implements Resolve<any> {

  departments: Department[];
  onDepartmentsChanged: BehaviorSubject<Department[]>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.baseURL = this.appConfig['config']['URL'];
    }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getDepartments()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getDepartments(): Promise<Department[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/department/list')
          .subscribe((response: any[]) => {

            this.departments = response.map(res => new Department(res));
            this.onDepartmentsChanged.next(this.departments);
            
            resolve(this.departments);
          }, reject);
        });
  }

  getDepartmentsForAdvancedSearch(): Promise<Department[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/advanced-search/departments')
          .subscribe((response: any[]) => {
            resolve(response.map(res => new Department(res)));
          }, reject);
        });
  }

  getDepartmentsByClientId(clientId): Promise<Department[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + `/api/department/list/client/${clientId}`)
          .subscribe((response: any[]) => {

            var departments = response.map(res => new Department(res));
            resolve(departments);
          }, reject);
        });
  }

  addDepartment(department): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/department/add', department)
        .subscribe(response => {
          this.getDepartments();
          resolve(response);
        }, reject);
    });
  }

  updateDepartment(department): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/department/update', department)
        .subscribe(response => {
          this.getDepartments();
          resolve(response);
        }, reject);
    });
  }

  deleteDepartment(department): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/department/remove', department)
        .subscribe(response => {
          this.getDepartments();
          resolve(response);
        }, reject);
    });
  }
}
