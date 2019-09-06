import { AppUser } from "./app-user.model";
import { Client } from "./client.model";
import * as moment from 'moment';
import { create } from 'domain';

export class FileStorage {
    owner: AppUser;
    client: Client;
    parentStorageId?: number;
    id: any;
    name: string;
    permissions: Permission[] = [];

    storages: Storage[] = [];

    constructor(fileStorage?) {

        var fileStorage = fileStorage || {};

        this.id = fileStorage.id || null;
        this.name = fileStorage.name || null;
        this.parentStorageId = fileStorage.parentStorageId || null;
        this.owner = fileStorage.owner ? new AppUser(fileStorage.owner) : null;
        this.client = fileStorage.client ? new Client(fileStorage.client) : null;

        this.storages = fileStorage.storages ? fileStorage.storages.map(storage => new Storage(storage)) : [];
        this.permissions = fileStorage.permissions ? fileStorage.permissions.map(permission => new Permission(permission)) : [];
    }
}

export class Storage {
    id: any;
    name: string;
    isDirectory: boolean;
    createBy: AppUser;
    createDate: string;
    updateBy: AppUser;
    updateDate: string;
    owner: AppUser;
    client: Client;
    storageType: string;
    file: File;
    permissions: Permission[] = [];
    isAvailableToUpdate: boolean = false;
    isAvailableToAddPermision: boolean = false;

    constructor(storage?) {
        var storage = storage || {};

        
        this.id = storage.id || null;
        this.name = storage.name || null;
        this.isDirectory = storage.isDirectory || false;
        this.createBy = storage.createBy ? new AppUser(storage.createBy) : null;
        this.createDate = moment.utc(storage.createDate).local().format('YYYY-MM-DD HH:mm:ss') || moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.updateDate = storage.updateDate ? moment.utc(storage.updateDate).local().format('YYYY-MM-DD HH:mm:ss') : null;
        this.updateBy = storage.updateBy ? new AppUser(storage.updateBy) : null;
        this.owner = storage.owner ? new AppUser(storage.owner) : null;
        this.client = storage.client ? new Client(storage.client) : null;
        this.storageType = storage.storageType || null;

        this.file = storage.file ? new File(storage.file) : null;
        this.permissions = storage.permissions ? storage.permissions.map(permission => new Permission(permission)) : [];
    }
}

export class File {
    id: number;
    extension: string;
    size: number;
    sizeType: string;

    constructor(file?) {

        var file = file || {};

        this.id = file.id || null;
        this.extension = file.extension || null;
        this.size = file.size || null;
        this.sizeType = file.sizeType || null;
    }
}

export class Permission {
    recipient: AppUser;
    type: PermissionType;

    constructor(permission?) {
        var permission = permission || {};

        this.type = permission.type || null;
        this.recipient = permission.recipient ? new AppUser(permission.recipient) : null;
    }
}

export enum PermissionType {
    readOnly = 0,
    readAndWrite = 1
}