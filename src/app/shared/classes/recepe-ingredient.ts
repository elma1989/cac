import { EditState } from "../enums/edit-state";
import { DataObject } from "../interfaces/data-object";
import { RecepeIngredientStorage } from "../interfaces/ingredient-data";
import { Ingredient } from "./ingredient";

export class RecepeIngredient implements DataObject {
    id: string;
    private _ingredient!: Ingredient;
    private _amount!: number;
    private _state: EditState = EditState.DEFAULT;

    constructor(ingredient: Ingredient, id: string = '', amount: number = 0) {
        this.id = id;
        this.ingredient = ingredient;
        this.amount = amount;
    }

    get amount(): number { return this._amount; }

    set amount(amount: number) { this._amount = amount; }

    get ingredient(): Ingredient { return this._ingredient; }

    set ingredient(ingredient: Ingredient) { this._ingredient = ingredient; }

    get value(): string {
        return this.ingredient.unit == 'piece' ? `${this.amount} ${this.ingredient.unit}` : this.amount + this.ingredient.unit;
    }

    get state(): EditState { return this._state; }

    set state(state: EditState) { this._state = state; }
    toJSON(): Record<string, any> { return {
        id: this.id,
        ingredient: this.ingredient.toJSON(),
        amount: this.amount
    };}

    toJSONLocal(): Record<string, any> { return {
        ...this.toJSON(),
        ingredient: this.ingredient.toJSONLocal(),
        state: this.state
    };}

    /**
     * Gets a recepe ingredient from strored data.
     * @param data - Strored data of Recepe-Ingredient.
     * @returns Intance of RecepeIngredient.
     */
    static fromStorage(data: RecepeIngredientStorage): RecepeIngredient {
        const temp = new RecepeIngredient(
            Ingredient.fromStorage(data.ingredient),
            data.id,
            data.amount
        );
        temp.state = data.state;
        return temp;
    }
}
