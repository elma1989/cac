import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Firestore, Unsubscribe } from '@angular/fire/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { IngredientData } from '../interfaces/ingredient-data';
import { Ingredient } from '../classes/ingredient';
import { RecepeIngredient } from '../classes/recepe-ingredient';
import { DirectionData } from '../interfaces/direction-data';
import { Direction } from '../classes/direction';
import { RecepeData } from '../interfaces/recepe-data';
import { Recepe } from '../classes/recepe';

interface RecepeIngredientData {
  id: string;
  recepe: string;
  ingredient: string | Ingredient | undefined;
  amount: number;
}

interface DirectionDataDB extends DirectionData {
  recepe: string;
  pos: number;
}

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  private firestore = inject(Firestore);
  private unsubIngredient!: Unsubscribe;
  private unSubDirection!: Unsubscribe;
  private unsubRecepeIngredient!: Unsubscribe;
  private unsubRecepe!: Unsubscribe;

  private recepeIngredientData: RecepeIngredientData[] = [];
  private recepeDirectionData: DirectionDataDB[] = [];

  ingredients: WritableSignal<Ingredient[]> = signal([]);
  recepes: WritableSignal<Recepe[]> = signal([]);

  constructor() {
    this.loadIngredients();
  }

  // #region Helper
  /**
   * Gets ingredients for a recepe.
   * @param recepeID - Id of recepe.
   * @returns List of ingredients for Recepe.
   */
  private ingredieantsFromRecepe(recepeID: string): RecepeIngredient[] {
    const ingredients = this.ingredients();
    return this.recepeIngredientData
      .filter(recepeData => recepeData.recepe == recepeID)
      .map(recpeData => {
        recpeData.ingredient = ingredients.find(ing => ing.id == recpeData.ingredient);
        return recpeData;
      })
      .filter(recepeData => recepeData.ingredient != undefined)
      .map(recepeData => recepeData.ingredient = new RecepeIngredient(recepeData.id, recepeData.ingredient as Ingredient, recepeData.amount))
      .sort((a,b) => a.name.localeCompare(b.name));
  }

  /**
   * Gets directions for a recepe.
   * @param recepeId - Id of recepe.
   * @returns - Directions from recepe
   */
  private directionsFromRecipe(recepeId: string): Direction[] {
    return this.recepeDirectionData
      .filter(recepeDirection => recepeDirection.recepe == recepeId)
      .sort((a,b) => a.pos - b.pos)
      .map(dirData => new Direction(dirData.id, dirData.title, dirData.description));
  }
  // #endregion
  // #region Loading Data
  private loadRecepes() {
    const docRef = collection(this.firestore, 'recepe');
    this.unsubRecepe = onSnapshot(docRef, snapshot => {
      const recepes = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as RecepeData))
        .sort((a,b) => a.title.localeCompare(b.title))
        .map(recepeData => {
          recepeData.ingredients = this.ingredieantsFromRecepe(recepeData.id);
          recepeData.directions = this.directionsFromRecipe(recepeData.id);
          return recepeData;
        })
        .map(recepeData => new Recepe(recepeData));
      this.recepes.set(recepes);
    }, error => console.error('Loading recepe error', error));
  }

  /** Loads all directions from Database. */
  private loadDirections() {
    const docRef = collection(this.firestore, 'direction');
    this.unSubDirection = onSnapshot(docRef, snapshot => {
      const directionData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as DirectionDataDB));
      this.recepeDirectionData = directionData;
      this.loadRecepes();
    }, error => console.error('Loading direction error', error));
  }

  /** Loads Ingredients for each recepe. */
  private loadRecepeIngredients() {
    const docRef = collection(this.firestore, 'ingredient-in-recepe');
    const ingredients = this.ingredients();
    this.unsubIngredient = onSnapshot(docRef,
      snapshot => {
        this.recepeIngredientData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as RecepeIngredientData))
        this.loadDirections();
      }, error => console.error('Loading recepe-ingredient error:', error)
    );
  }

  /** Loads all registered ingredients */
  private loadIngredients() {
    const docRef = collection(this.firestore, 'ingredient');
    this.unsubIngredient = onSnapshot(docRef,
      snapshot => {
        const ingredients = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as IngredientData));
        const sortedIngredients = ingredients
          .sort((a,b) => a.name.localeCompare(b.name, 'de'))
          .map(ing => new Ingredient(ing))
        this.ingredients.set(sortedIngredients);
        this.loadRecepeIngredients();
      }, error => console.error('Loading ingredient error:', error)
    );
  }
  // #endregion
}