import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { RecepeIngredient } from '../../../shared/classes/recepe-ingredient';

@Component({
  selector: 'section[recepe-detail-ingredients]',
  imports: [],
  templateUrl: './recepe-detail-ingredients.component.html',
  styleUrl: './recepe-detail-ingredients.component.scss'
})

export class RecepeDetailIngredientsComponent {
  recepeIngredients: InputSignal<RecepeIngredient[]> = input.required<RecepeIngredient[]>();

  ingredientsShown: WritableSignal<boolean> = signal(true);

  /** Swiches to show and hide ingredients (for mobile) */
  protected toggleIngredients() {
    this.ingredientsShown.set(!this.ingredientsShown());
  }

  /** Combines amound and unit of ingredient in recepe */
  protected recepeIngredientAmount(ingredient: RecepeIngredient): string {
    if (ingredient.unit == 'piece') return `${ingredient.name} ${ingredient.unit}`;
    return ingredient.amount + ingredient.unit;
  }
}
