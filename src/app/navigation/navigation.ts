import { FuseNavigation, FuseNavigationItem } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Saphir Cloud Box',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        hidden   :  true,
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
    },
    {
        id       : 'user-menu',
        title    : 'User Menu',
        translate: 'NAV.USERMENU',
        type     : 'group',
        hidden   :  true,
        children : [
            {
                id: 'user-group',
                title: 'User Groups',
                translate: 'NAV.USERGROUPS',
                type: 'collapsable',
                button: {
                    id: 'add-group',
                    title: 'Add Group',
                    icon: 'add'
                },
                children: []
            }
        ]
    },
    {
        id: 'file-manager',
        title: 'File Manager',
        type: 'group',
        hidden   :  true,
        children: [
            {
                id: 'advanced-search',
                title: 'Advansed Search',
                translate: 'NAV.ADVANCEDSEARCH',
                type: 'item',
                url: '/file-manager/advanced/search',
                icon: 'search' 
            }
        ]
    },
    {
        id       : 'help',
        title    : 'Help',
        translate: 'NAV.HELP',
        type     : 'group',
        hidden   :  true,
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
];