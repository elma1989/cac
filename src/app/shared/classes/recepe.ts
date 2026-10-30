import { Cuisine } from "../enums/cuisine";
import { EditState } from "../enums/edit-state";
import { FoodCategory } from "../enums/food-category";
import { DataObject } from "../interfaces/data-object";
import { RecepeData, RecepeStorage } from "../interfaces/recepe-data";
import { Direction } from "./direction";
import { RecepeIngredient } from "./recepe-ingredient";

export class Recepe implements DataObject {
    id: string;
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
    private _likes: number;
    private _state: EditState = EditState.DEFAULT;

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
        protein: 0,
        likes: 0
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
        this._likes = data.likes;
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

    get ingredients(): RecepeIngredient[] { return this._ingredients; }

    set ingredients(ingredients: RecepeIngredient[]) { this._ingredients = ingredients; }
    
    get directions(): Direction[] { return this._directions; }

    get energy(): number { return this._energy; }

    get carbs(): number { return this._carbs; }

    get fat(): number { return this._fat; }

    get protein(): number { return this._protein; }

    get likes(): number { return this._likes; }

    get state(): EditState { return this._state; }

    set state(state: EditState) { this._state = state; }

    get data(): RecepeData { return {
        id: this.id,
        title: this.title,
        category: this.category,
        cuisine: this.cuisine,
        ingredients: this.ingredients,
        directions: this.directions,
        duration: this.duration,
        energy: this.energy,
        carbs: this.carbs,
        fat: this.fat,
        protein: this.protein,
        likes: this.likes
    }; }

    toJSON(): Record<string, any> { return {
        ...this.data,
        ingredients: this.ingredients.map(ing => ing.toJSON()),
        directions: this.directions.map(dir => dir.toJSON())
    }; }

    toJSONLocal(): Record<string, any> { return {
        ...this.data,
        ingredients: this.ingredients.map(ing => ing.toJSONLocal()),
        directions: this.directions.map(dir => dir.toJSONLocal())
    }; }

    /**
     * Gets a recepe from storage.
     * @param data - Data from storage.
     * @returns Instance of Recepe.
     */
    static fromStrorage(data: RecepeStorage): Recepe {
        const temp = new Recepe({
            id: data.id,
            title: data.title,
            duration: data.duration,
            ingredients: data.ingredients.map(ing => RecepeIngredient.fromStorage(ing)),
            directions: data.directions.map(dir => Direction.fromStorage(dir)),
            fat: data.fat,
            carbs: data.carbs,
            protein: data.protein,
            energy: data.energy,
            likes: data.likes,
            category: data.category,
            cuisine: data.cuisine
        });
        temp.state = data.state;
        return temp;
    }

    /**
     * Loads data from storage.
     * @returns Founded recepe or null, if not found.
     */
    static load() {
        const storage = localStorage.getItem('edited-recepe');
        if (!storage) return null;
        const data = JSON.parse(storage);
        return Recepe.fromStrorage(data);
    }

    /** Saves recepe data in local storage. */
    save() {
        localStorage.setItem('edited-recepe', JSON.stringify(this.toJSONLocal()));
    }
}
