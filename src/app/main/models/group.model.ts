import { AppUser } from "./app-user.model";

export class Group { 
    id: number;
    name: string;
    users: AppUser[] = [];

    constructor(group?) {
        var group = group || {};

        this.id = group.id || null;
        this.name = group.name || null;
        this.users = group.users ? group.users.map(user => new AppUser(user)) : [];
    }
}