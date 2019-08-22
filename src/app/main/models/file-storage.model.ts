import { AppUser } from "./app-user.model";
import { Client } from "./client.model";

export class FileStorage {
    owner: AppUser;
    client: Client;
    parentStorageId?: number;
    id: number;
    name: string;

    storages: Storage[] = [];

    constructor(fileStorage?) {

        var fileStorage = fileStorage || {};

        this.id = fileStorage.id || null;
        this.name = fileStorage.name || null;
        this.parentStorageId = fileStorage.parentStorageId || null;
        this.owner = fileStorage.owner ? new AppUser(fileStorage.owner) : null;
        this.client = fileStorage.client ? new Client(fileStorage.client) : null;

        this.storages = fileStorage.storages ? fileStorage.storages.map(storage => new Storage(storage)) : null;
    }
}

export class Storage {
    id: number;
    name: string;
    isDirectory: boolean;
    createBy: AppUser;
    createDate: Date;
    updateBy: AppUser;
    updateDate: Date;
    owner: AppUser;
    client: Client;
    storageType: string;
    file: File;
    permissions: Permission[] = [];

    constructor(storage?) {
        var storage = storage || {};

        
        this.id = storage.id || null;
        this.name = storage.name || null;
        this.isDirectory = storage.isDirectory || false;
        this.createBy = storage.createBy ? new AppUser(storage.createBy) : null;
        this.createDate = storage.createDate || null;
        this.updateBy = storage.updateBy ? new AppUser(storage.updateBy) : null;
        this.updateDate = storage.updateDate || null;
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