export class Role {
    id: number;
    name: string;

    constructor(role?) {
        var role = role || {};

        this.id = role.id || null;
        this.name = role.name || null;
    }
}