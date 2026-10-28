import { EditState } from "../enums/edit-state";
import { DataObject } from "../interfaces/data-object";
import { IngredientData, IngredientStorage } from "../interfaces/ingredient-data";
import { BaseUnit } from "./types";

export class Ingredient  implements DataObject {
    readonly id: string;
    private _name: string;
    private _unit!: BaseUnit;
    private _possibleUnits!: string[];
    private _state: EditState = EditState.DEFAULT;

    /**
     * Creates an ingredient.
     * @param data - Data of ingredient, default: empty.
     */
    constructor(data: IngredientData = {
        id: '',
        name: '',
        unit: 'g'
    }) {
        this.id = data.id;
        this._name = data.name;
        this.unit = data.unit;
    }

    get name(): string { return this._name; }

    get unit(): BaseUnit { return this._unit; }

    set unit(unit: BaseUnit) {
        this._unit = unit;
        this.setExtendedUnits();
    }

    get possibleUnits(): string[] { return this._possibleUnits; }

    get state(): EditState { return this._state; }

    set state(state: EditState) { this._state = state; }

    toJSON(): Record<string, any> { return {
        id: this.id,
        name: this.name,
        unit: this.unit,
    };}

    toJSONLocal(): Record<string, any> { return {
        ...this.toJSON(),
        state: this.state
    };}

    private setExtendedUnits() {
        switch(this.unit) {
            case 'g':
                this._possibleUnits = ['g', 'kg'];
                break;

            case 'ml':
                this._possibleUnits = ['ml', 'l'];
                break;

            case 'piece':
                this._possibleUnits = ['piece'];
        }
    }

    /**
     * Gets ingredient from stroage
     * @param data Data in storage
     * @returns Instance of ingredient.
     */
    static fromStorage(data: IngredientStorage) {
        const temp = new Ingredient({
            id: data.id,
            name: data.name,
            unit: data.unit
        });
        temp.state = data.state;
        return temp;
    }
}
