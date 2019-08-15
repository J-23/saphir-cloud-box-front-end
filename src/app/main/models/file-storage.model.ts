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
    storageType: string;

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
        this.storageType = storage.storageType || null;
    }
}