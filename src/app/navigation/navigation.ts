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
                title    : 'Kunden',
                translate: 'NAV.CLIENTS',
                type     : 'item',
                url      : '/apps/clients'
            },
            {
                id       : 'departments',
                title    : 'Objekte',
                translate: 'NAV.DEPARTMENTS',
                type     : 'item',
                url      : '/apps/departments'
            },
            {
                id       : 'roles',
                title    : 'Rollen',
                translate: 'NAV.ROLES',
                type     : 'item',
                url      : '/apps/roles'
            },
            {
                id       : 'users',
                title    : 'Benutzern',
                translate: 'NAV.USERS',
                type     : 'item',
                url      : '/apps/users'
            }
        ]
    }
];
