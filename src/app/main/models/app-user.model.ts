import { Client } from "./client.model";
import { Department } from "./department.model";
import { Role } from "./role.model";

export class AppUser {
    id: number;
    userName: string;
    email: string;
    client: Client;
    department?: Department;
    role: Role;
    createDate: Date;
    updateDate?: Date;

    constructor(user?) {
        var user = user || {};

        this.id = user.id || null;
        this.userName = user.userName || null;
        this.email = user.email || null;
        this.client = new Client(user.client);
        this.department = new Department(user.department);
        this.role = new Role(user.role);
        this.createDate = user.createDate || new Date();
        this.updateDate = user.updateDate || null;
    }
}