import { Component, computed, inject, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
import { RecepeIngredient } from '../../../shared/classes/recepe-ingredient';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Ingredient } from '../../../shared/classes/ingredient';

@Component({
  selector: 'section[recepe-detail-ingredients]',
  imports: [IngredientEditComponent],
  templateUrl: './recepe-detail-ingredients.component.html',
  styleUrl: './recepe-detail-ingredients.component.scss'
})

export class RecepeDetailIngredientsComponent {
  db: FirestoreService = inject(FirestoreService);

  recepeIngredients: InputSignal<RecepeIngredient[]> = input.required<RecepeIngredient[]>();

  ingredientsShown: WritableSignal<boolean> = signal(true);
  ingredients: Signal<Ingredient[]> = computed(() => this.db.ingredients());

  /** Swiches to show and hide ingredients (for mobile) */
  protected toggleIngredients() {
    this.ingredientsShown.set(!this.ingredientsShown());
  }
}
