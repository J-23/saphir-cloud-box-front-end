export class Role {
    id: number;
    name: string;
    type: RoleType;

    constructor(role?) {
        var role = role || {};

        this.id = role.id || null;
        this.name = role.name || null;
        
        this.getRole(role.roleType);
    }

    getRole(roleType) {

        if (roleType === 0) {
            this.type = RoleType.SuperAdmin;
        }
        else if (roleType === 1) {
            this.type = RoleType.ClientAdmin;
        }
        else if (roleType === 2) {
            this.type = RoleType.DepartmentHead;
        }
        else if (roleType === 3) {
            this.type = RoleType.Employee;
        }
        else {
            this.type = RoleType.Employee;
        }
    }
}

export enum RoleType {
    SuperAdmin = 0,
    ClientAdmin = 1,
    DepartmentHead = 2,
    Employee = 3
}