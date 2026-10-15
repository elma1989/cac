import { Ingredient } from '../classes/ingredient';
import { RecepeIngredient } from '../classes/recepe-ingredient';
import { DirectionData } from '../interfaces/direction-data';
import { Direction } from '../classes/direction';

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
}