import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class AppConfig {

    private config: Object = null;
    private env: Object = null;
    configUrl = 'assets/AppConfig.json'
    constructor(private http: Http) {
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get(this.configUrl).subscribe(
                data => {
                    this.config = data.json();
                    resolve(true);
                });
        });

    }
}