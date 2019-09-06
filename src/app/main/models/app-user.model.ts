import { Client } from "./client.model";
import { Department } from "./department.model";
import { Role } from "./role.model";
import * as moment from 'moment';
import { create } from 'domain';

export class AppUser {
    id: number;
    userName: string;
    email: string;
    client: Client;
    department?: Department;
    role: Role;
    createDate: string;
    updateDate?: string;

    constructor(user?) {
        var user = user || {};

        this.id = user.id || null;
        this.userName = user.userName || null;
        this.email = user.email || null;
        this.client = new Client(user.client);
        this.department = new Department(user.department);
        this.role = new Role(user.role);
        this.createDate = moment.utc(user.createDate).local().format('YYYY-MM-DD HH:mm:ss') || moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.updateDate = user.updateDate ? moment.utc(user.updateDate).local().format('YYYY-MM-DD HH:mm:ss') : null;
    }
}