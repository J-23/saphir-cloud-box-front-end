export class File {
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;

    constructor(file?) {
        var file = file || {};

        this.id = file.id || null;
        this.name = file.name || null;
        this.createDate = file.createDate || new Date();
        this.updateDate = file.updateDate || null;
    }
}