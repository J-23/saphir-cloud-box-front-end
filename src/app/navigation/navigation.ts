import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Saphir Cloud Box',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'clients',
                title    : 'Clients',
                translate: 'NAV.CLIENTS',
                type     : 'item',
                url      : '/apps/clients'
            },
            {
                id       : 'departments',
                title    : 'Departments',
                translate: 'NAV.DEPARTMENTS',
                type     : 'item',
                url      : '/apps/departments'
            },
            {
                id       : 'roles',
                title    : 'Roles',
                translate: 'NAV.ROLES',
                type     : 'item',
                url      : '/apps/roles'
            },
            {
                id       : 'users',
                title    : 'Users',
                translate: 'NAV.USERS',
                type     : 'item',
                url      : '/apps/users'
            }
        ]
    }
];
