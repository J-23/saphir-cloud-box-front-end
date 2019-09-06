import { Client } from "./client.model";
import * as moment from 'moment';
import { create } from 'domain';

export class Department { 
    id: number;
    name: string;
    createDate: string;
    updateDate?: string;
    client: Client;

    constructor(department?) {
        var department = department || {};

        this.id = department.id || null;
        this.name = department.name || null;
        this.createDate = moment.utc(department.createDate).local().format('YYYY-MM-DD HH:mm:ss') || moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.updateDate = department.updateDate ? moment.utc(department.updateDate).local().format('YYYY-MM-DD HH:mm:ss') : null;

        this.client = new Client(department.client);
    }
}