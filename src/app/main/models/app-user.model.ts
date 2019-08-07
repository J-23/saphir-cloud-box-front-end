import { Client } from "./client.model";
import { Department } from "./department.model";

export class AppUser {
    id: number;
    userName: string;
    email: string;
    client: Client;
    department?: Department;

    constructor(user?) {
        var user = user || {};

        this.id = user.id || 0;
        this.userName = user.userName || null;
        this.email = user.email || null;
        this.client = new Client(user.client);
        this.department = new Department(user.department);
    }
}