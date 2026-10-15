export class Direction {
    readonly id: string;
    private _title: string;
    private _description: string;

    constructor(id: string = '', title: string = '', description: string = '') {
        this.id = id;
        this._title = title;
        this._description = description;
    }

    get title(): string { return this._title; }

    get description(): string { return this._description; }
}
