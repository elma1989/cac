import { Ingredient } from "./ingredient";

export class RecepeIngredient extends Ingredient {
    readonly comboId: string;
    private _amount: number;

    constructor(comboId: string, ingredient: Ingredient, amount: number) {
        super(ingredient.data);
        this.comboId = comboId;
        this._amount = amount;
    }

    get amount(): number { return this._amount; }
}