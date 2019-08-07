import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from 'app/main/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService implements Resolve<any> {

  clients: Client[];
  onClientsChanged: BehaviorSubject<Client[]>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onClientsChanged = new BehaviorSubject([]);
    this.baseURL = this.appConfig['config']['URL'];
    }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getClients()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getClients(): Promise<Client[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/client/list')
          .subscribe((response: any[]) => {

            this.clients = response.map(res => new Client(res));
            this.onClientsChanged.next(this.clients);
            
            resolve(this.clients);
          }, reject);
        });
  }

  addClient(client): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/client/add', client)
        .subscribe(response => {
          this.getClients();
          resolve(response);
        }, reject);
    });
  }

  updateClient(client): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/client/update', client)
        .subscribe(response => {
          this.getClients();
          resolve(response);
        }, reject);
    });
  }

  deleteClient(client): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/client/remove', client)
        .subscribe(response => {
          this.getClients();
          resolve(response);
        }, reject);
    });
  }
}
