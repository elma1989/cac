import { Direction, DirectionStorage } from "../classes/direction";
import { RecepeIngredient } from "../classes/recepe-ingredient";
import { Cuisine } from "../enums/cuisine";
import { EditState } from "../enums/edit-state";
import { FoodCategory } from "../enums/food-category";
import { RecepeIngredientStorage } from "./ingredient-data";

export interface RecepeData {
    id: string;
    title: string;
    category: FoodCategory;
    cuisine: Cuisine;
    duration: number;
    ingredients: RecepeIngredient[];
    directions: Direction[];
    energy: number;
    fat: number;
    carbs: number;
    protein: number;
    likes: number;
}

export interface RecepeStorage {
    id: string;
    title: string;
    category: FoodCategory;
    cuisine: Cuisine;
    duration: number;
    ingredients: RecepeIngredientStorage[]
    directions: DirectionStorage[]
    energy: number;
    fat: number;
    carbs: number;
    protein: number;
    likes: number;
    state: EditState
}
