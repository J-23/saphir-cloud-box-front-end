import { FuseNavigation, FuseNavigationItem } from '@fuse/types';

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

export const appNavigation: FuseNavigation = {
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
};

export const helpNavigation: FuseNavigation = {
    id       : 'help',
    title    : 'Help',
    translate: 'NAV.HELP',
    type     : 'group',
    children : [
        {
            id       : 'faq',
            title    : 'Faq',
            translate: 'NAV.FAQ',
            type     : 'item',
            url      : '/info/faq'
        },
        {
            id       : 'feedback',
            title    : 'Feedback',
            translate: 'NAV.FEEDBACK',
            type     : 'item',
            url      : '/info/feedback'
        }
    ]
}

export const userNavigation: FuseNavigation = {
    id       : 'user-menu',
    title    : 'User Menu',
    translate: 'NAV.USERMENU',
    type     : 'group',
    children : [
        {
            id       : 'user-groups',
            title    : 'User Groups',
            translate: 'NAV.USERGROUPS',
            type     : 'item',
            url      : '/user-menu/groups'
        }
    ]
}

export const advancedSearchNavigation: FuseNavigationItem = {
    id: 'advanced-search',
    title: 'Advansed Search',
    translate: 'NAV.ADVANCEDSEARCH',
    type: 'item',
    url: '/file-manager/advanced-search',
    icon: 'search'
}