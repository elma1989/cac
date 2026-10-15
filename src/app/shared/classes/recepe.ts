import { Cuisine } from "../enums/cuisine";
import { FoodCategory } from "../enums/food-category";
import { RecepeData } from "../interfaces/recepe-data";
import { Direction } from "./direction";
import { RecepeIngredient } from "./recepe-ingredient";

export class Recepe {
    readonly id: string;
    private _title: string;
    private _duaration: number;
    private _category: FoodCategory;
    private _cuisine: Cuisine;
    private _ingredients: RecepeIngredient[];
    private _directions: Direction[];
    private _energy: number;
    private _carbs: number;
    private _fat: number;
    private _protein: number;

    constructor(data: RecepeData = {
        id: '',
        title: '',
        category: FoodCategory.ALL,
        cuisine: Cuisine.GERMAN,
        ingredients: [],
        directions: [],
        duration: 20,
        energy: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    }) {
        this.id = data.id;
        this._title = data.title;
        this._category = data.category;
        this._cuisine = data.cuisine;
        this._ingredients = data.ingredients;
        this._directions = data.directions;
        this._duaration = data.duration;
        this._energy = data.energy;
        this._carbs = data.carbs;
        this._fat = data.fat;
        this._protein = data.protein;
    }

    get title(): string { return this._title; }
    
    get duration(): number { return this._duaration; }

    get durationLabel(): string {
        if (this.duration <= 20) return 'Quick';
        if (this.duration <= 45) return 'Medium';
        return 'Hard';
    }

    get category(): FoodCategory { return this._category; }

    get cuisine(): Cuisine { return this._cuisine; }

    get indredients(): RecepeIngredient[] { return this._ingredients; }
    
    get directions(): Direction[] { return this._directions; }

    get energy(): number { return this._energy; }

    get carbs(): number { return this._carbs; }

    get fat(): number { return this._fat; }

    get protein(): number { return this._protein; }
}
