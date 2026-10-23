import { EditState } from "../enums/edit-state";
import { Ingredient } from "./ingredient";

export class RecepeIngredient {
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
}