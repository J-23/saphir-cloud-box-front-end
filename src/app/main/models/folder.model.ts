import { File } from "./file.model";

export class Folder {
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;
    files: File[] = [];

    constructor(folder?) {
        var folder = folder || {};

        this.id = folder.id || null;
        this.name = folder.name || null;
        this.createDate = folder.createDate || new Date();
        this.updateDate = folder.updateDate || null;
        this.files = folder.files.map(file => new File(file));
    }
}