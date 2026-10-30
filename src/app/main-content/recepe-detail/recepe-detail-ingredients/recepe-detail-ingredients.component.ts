import { Component, computed, inject, input, InputSignal, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { RecepeIngredient } from '../../../shared/classes/recepe-ingredient';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Ingredient } from '../../../shared/classes/ingredient';
import { EditState } from '../../../shared/enums/edit-state';

@Component({
  selector: 'section[recepe-detail-ingredients]',
  imports: [IngredientEditComponent],
  templateUrl: './recepe-detail-ingredients.component.html',
  styleUrl: './recepe-detail-ingredients.component.scss'
})

export class RecepeDetailIngredientsComponent {
  db: FirestoreService = inject(FirestoreService);

  recepeIngredients: InputSignal<RecepeIngredient[]> = input.required<RecepeIngredient[]>();
  editMode: InputSignal<boolean> = input<boolean>(false);

  changedIngredients: OutputEmitterRef<RecepeIngredient[]> = output<RecepeIngredient[]>();

  ingredientsShown: WritableSignal<boolean> = signal(true);
  ingredients: Signal<Ingredient[]> = computed(() => this.db.ingredients());
  protected createdIngredient: WritableSignal<RecepeIngredient | null> = signal(null);
  protected EditState = EditState;

  /** Swiches to show and hide ingredients (for mobile) */
  protected toggleIngredients() {
    this.ingredientsShown.set(!this.ingredientsShown());
  }

  /** Enables input field to create ingredient. */
  enabelCreateIngredient() {
    const temp = new RecepeIngredient(new Ingredient());
    temp.state = EditState.CREATED;
    temp.editMode = true;
    this.createdIngredient.set(temp);
    this.recepeIngredients().forEach(ing => ing.editMode = false);
  }

  /**
   * Enables edit mode for one ingredient.
   * @param ingredient - Ingredeint for enable
   */
  enableEditIngedient(ingredient: RecepeIngredient) {
    const cIng = this.createdIngredient();
    this.recepeIngredients().forEach(ing => ing.editMode = ing == ingredient ? true : false);
    if (cIng) this.createdIngredient.set(null);
  }

  /** Adds preselected created ingredient to ingredient list. */
  private addIngredient() {
    const rIngs = this.recepeIngredients();
    const cIng = this.createdIngredient();
    if (cIng) {
      this.createdIngredient.set(null);
      const foundIng = rIngs.find(ing => ing.ingredient == cIng.ingredient);
      if (foundIng) {
        foundIng.amount += cIng.amount;
        foundIng.state = EditState.EDITED
      } else {
        rIngs.push(cIng);
      }
      this.changedIngredients.emit(rIngs);
    }
  }

  /**
   * Updates an ingredient.
   * @param ingredient - Ingredient for updated.
   */
  private updateIngredient(ingredient: RecepeIngredient) {
    let ingredients = this.recepeIngredients();
    let currentIngredient = ingredients.find(ing => ing.ingredient == ingredient.ingredient)
    if (currentIngredient) {
      const editIngredient = ingredients.find(ing => ing.ingredient == ingredient.ingredient && ing.state == EditState.DEFAULT);
      if (editIngredient) editIngredient.state = EditState.DELETED;
      currentIngredient = ingredient;
    }
    this.changedIngredients.emit(ingredients);
  }

  /**
   * Modifies the list of ingredients.
   * @param ingredient - Ingredient for delete.
   */
  private deleteIngredient(ingredient: RecepeIngredient) {
    let ings = this.recepeIngredients();
    if (ingredient.id.length == 0) ings = ings.filter(ing => ing != ingredient);
    this.createdIngredient.set(null);
    this.changedIngredients.emit(ings);
  }

  handleChangedIngredient(ingredient: RecepeIngredient) {
    switch(ingredient.state) {
      case EditState.CREATED:
        this.addIngredient();
        break;
      case EditState.EDITED:
        this.updateIngredient(ingredient);
        break;
      case EditState.DELETED:
        this.deleteIngredient(ingredient);
    }
  }
}
