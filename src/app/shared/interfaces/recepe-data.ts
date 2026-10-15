import { Direction } from "../classes/direction";
import { RecepeIngredient } from "../classes/recepe-ingredient";
import { Cuisine } from "../enums/cuisine";
import { FoodCategory } from "../enums/food-category";

export interface RecepeData {
    id: string;
    title: string;
    category: FoodCategory;
    cuisine: Cuisine;
    duration: number;
    energy: number;
    fat: number;
    carbs: number;
    protein: number;
    ingredients: RecepeIngredient[];
    directions: Direction[];
}