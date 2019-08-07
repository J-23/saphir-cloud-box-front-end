import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Fuhrpark',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            /*{
                id       : 'carGroups',
                title    : 'Kostenträger',
                translate: 'NAV.CARGROUPS',
                type     : 'item',
                url      : '/apps/car-groups'
            },
            {
                id       : 'carSubgroups',
                title    : 'BAB Kostenstelle',
                translate: 'NAV.CARSUBGROUPS',
                type     : 'item',
                url      : '/apps/car-subgroups'
            },*/
            {
                id       : 'cars',
                title    : 'Autos',
                translate: 'NAV.CARS',
                type     : 'item',
                url      : '/apps/cars/list'
            },
            {
                id       : 'manufacturers',
                title    : 'Hersteller',
                translate: 'NAV.MANUFACTURERS',
                type     : 'item',
                url      : '/apps/manufacturers'
            },
            {
                id       : 'typs',
                title    : 'Typ',
                translate: 'NAV.TYPS',
                type     : 'item',
                url      : '/apps/typs'
            },
            {
                id       : 'users',
                title    : 'Nutzer',
                translate: 'NAV.USERS',
                type     : 'item',
                url      : '/apps/users'
            },
            {
                id       : 'fuels',
                title    : 'Kraftstoff',
                translate: 'NAV.FUELS',
                type     : 'item',
                url      : '/apps/fuels'
            },
            {
                id       : 'engineOils',
                title    : 'Motoröl',
                translate: 'NAV.ENGINEOILS',
                type     : 'item',
                url      : '/apps/engine-oils'
            },
            {
                id       : 'gearOils',
                title    : 'Reifengröße',
                translate: 'NAV.CARWHEELS',
                type     : 'item',
                url      : '/apps/gear-oils'
            }
        ]
    }
];
