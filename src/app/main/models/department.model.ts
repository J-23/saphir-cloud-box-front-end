import { Client } from "./client.model";

export class Department { 
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;
    client: Client;

    constructor(department?) {
        var department = department || {};

        this.id = department.id || 0;
        this.name = department.name || null;
        this.createDate = department.createDate || new Date();
        this.updateDate = department.updateDate || null;

        this.client = new Client(department.client);
    }
}