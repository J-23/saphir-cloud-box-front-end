import * as moment from 'moment';
import { create } from 'domain';
export class Client { 
    id: number;
    name: string;
    createDate: string;
    updateDate?: string;

    constructor(client?) {
        var client = client || {};

        this.id = client.id || null;
        this.name = client.name || null;
        this.createDate = moment.utc(client.createDate).local().format('YYYY-MM-DD HH:mm:ss') || moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.updateDate = client.updateDate ? moment.utc(client.updateDate).local().format('YYYY-MM-DD HH:mm:ss') : null;
    }
}
