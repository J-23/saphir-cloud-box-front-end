import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Saphir Cloud Box',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        hidden: true,
        children: [
            {
                id: 'clients',
                title: 'Kunden',
                translate: 'NAV.CLIENTS',
                type: 'item',
                url: '/apps/clients'
            },
            {
                id: 'departments',
                title: 'Objekte',
                translate: 'NAV.DEPARTMENTS',
                type: 'item',
                url: '/apps/departments'
            },
            {
                id: 'roles',
                title: 'Rollen',
                translate: 'NAV.ROLES',
                type: 'item',
                url: '/apps/roles'
            },
            {
                id: 'users',
                title: 'Benutzern',
                translate: 'NAV.USERS',
                type: 'item',
                url: '/apps/users'
            }
        ]
    },
    {
        id: 'advanced-search',
        title: 'Erweiterte Suche',
        translate: 'NAV.ADVANCEDSEARCH',
        type: 'group',
        url: '/file-manager/advanced/search',
        children: [],
    },
    {
        id: 'file-manager',
        title: 'File Manager',
        translate: 'NAV.FILEMANAGER',
        type: 'group',
        children: [],
    },
    {
        id: 'my-file-manager',
        title: 'My File Manager',
        translate: 'NAV.MYFILEMANAGER',
        type: 'group',
        children: [],
    },
    // {
    //     id: 'user-group',
    //     title: 'Groups',
    //     translate: 'NAV.USERGROUPS',
    //     type: 'group',
    //     button: {
    //         id: 'add-group',
    //         title: 'Add Group',
    //         icon: 'add'
    //     },
    //     children: []
    // },
    {
        id: 'help',
        title: 'Help',
        translate: 'NAV.HELP',
        type: 'group',
        children: [
            // {
            //     id: 'faq',
            //     title: 'Faq',
            //     translate: 'NAV.FAQ',
            //     type: 'item',
            //     url: '/info/faq'
            // },
            {
                id: 'feedback',
                title: 'Feedback',
                translate: 'NAV.FEEDBACK',
                type: 'item',
                url: '/info/feedback'
            }
        ]
    }
];