import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FolderNavigationService {

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.baseURL = this.appConfig['config']['URL'];
  }

  getFolder(parentId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + `/api/file-storage/${parentId}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
      });
  }
}
