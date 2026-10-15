import { IngredientData } from "../interfaces/ingredient-data";

export class Ingredient {
    readonly id: string;
    private _name: string;
    private _unit: string;
    private _possibleUnits: string[];

    /**
     * Creates an ingredient.
     * @param data - Data of ingredient, default: empty.
     */
    constructor(data: IngredientData = {
        id: '',
        name: '',
        unit: '',
        possibleUnits: []
    }) {
        this.id = data.id;
        this._name = data.name;
        this._unit = data.unit;
        this._possibleUnits = data.possibleUnits;
    }

    get name(): string { return this._name; }

    get unit(): string { return this._unit; }

    get possibleUnits(): string[] { return this._possibleUnits; }

    get data(): IngredientData { return {
            id: this.id,
            name: this.name,
            unit: this.unit,
            possibleUnits: this.possibleUnits
        };
    }
}
