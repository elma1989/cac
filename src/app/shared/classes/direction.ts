import { EditState } from "../enums/edit-state";
import { DataObject } from "../interfaces/data-object";

export interface DirectionStorage {
    id: string,
    title: string,
    description: string,
    state: EditState
}

export class Direction implements DataObject {
    id: string;
    private _title: string;
    private _description: string;
    private _state: EditState = EditState.DEFAULT;

    constructor(id: string = '', title: string = '', description: string = '') {
        this.id = id;
        this._title = title;
        this._description = description;
    }

    get title(): string { return this._title; }

    get description(): string { return this._description; }

    get state(): EditState { return this._state; }

    set state(state: EditState) { this._state = state; }

    toJSON(): Record<string, any> { return {
        id: this.id,
        title: this.title,
        description: this.description
    }; }

    toJSONLocal(): Record<string, any> { return {
        ...this.toJSON(),
        state: this.state
    }; }

    /**
     * Gets Direction from storage data.
     * @param data - Data from storage.
     * @returns Instance of Direction
     */
    static fromStorage(data: DirectionStorage): Direction {
        const temp = new Direction(data.id, data.title, data.description);
        temp.state = data.state;
        return temp;
    }
}
