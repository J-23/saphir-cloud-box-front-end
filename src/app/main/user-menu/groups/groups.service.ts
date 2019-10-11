import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Group } from "app/main/models/group.model";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GroupsService {

    private baseURL: string;

    onGroupsChanged: BehaviorSubject<Group[]>;

    constructor(private _httpClient: HttpClient,
        private appConfig: AppConfig) {
            
        this.baseURL = this.appConfig['config']['URL'];
        this.onGroupsChanged = new BehaviorSubject([]);
    }

    getGroups(): Promise<Group[]> {
        return new Promise((resolve, reject) => {
        this._httpClient.get(this.baseURL + '/api/user-group/list')
            .subscribe((response: any) => {
            this.onGroupsChanged.next(response);
            resolve(response);
            }, reject);
        });
    }
}