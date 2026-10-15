import { DirectionData } from '../interfaces/direction-data';

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