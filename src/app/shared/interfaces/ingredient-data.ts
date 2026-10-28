import { BaseUnit } from "../classes/types";
import { EditState } from "../enums/edit-state";

export interface IngredientData {
    id: string;
    name: string;
    unit: BaseUnit;
}

export interface IngredientStorage extends IngredientData {
    state: EditState
}

export interface RecepeIngredientStorage {
    id: string,
    ingredient: IngredientStorage,
    amount: number,
    state: EditState
}
