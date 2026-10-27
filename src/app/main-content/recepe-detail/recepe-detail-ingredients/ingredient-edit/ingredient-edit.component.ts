import { Component, computed, ElementRef, input, InputSignal, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Ingredient } from '../../../../shared/classes/ingredient';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs';

@Component({
  selector: 'ingredient-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './ingredient-edit.component.html',
  styleUrl: './ingredient-edit.component.scss'
})
export class IngredientEditComponent {
  ingredients: InputSignal<Ingredient[]> = input<Ingredient[]>([]);


  protected editForm = new FormGroup({
    amount: new FormControl(0),
    unit: new FormControl('g'),
    name: new FormControl('')
  });
  protected selectedIngredient: WritableSignal<Ingredient | null> = signal<Ingredient | null>(null);
  private searchTerm: Signal<string> = toSignal(
    this.editForm.controls.name.valueChanges.pipe(
      startWith(this.editForm.controls.name.value),
      map(value => value?.trim().toLowerCase() ?? ''),
      tap(() => {
        this.activeIngredientIndex = -1;
        this.selectedIngredient.set(null);
      }),
      debounceTime(200),
      distinctUntilChanged()
    ), {initialValue: ''}
  )
  protected foundIngredients: Signal<Ingredient[]> = computed(() =>
    this.ingredients().filter(ing => ing.name.toLocaleLowerCase().includes(this.searchTerm())).slice(0, 3)
  );
  protected activeIngredientIndex: number = -1;
  @ViewChild('ingredientInput')
  private ingredientInputRef!: ElementRef<HTMLInputElement>;

  // #region Autocomplete ingreient
  /**
   * Selects an ingredient.
   * @param ingredient - Ingredient to select.
   */
  selectIngredient(ingredient: Ingredient) {
    this.editForm.controls.name.setValue(ingredient.name, {emitEvent: false});
    this.selectedIngredient.set(ingredient);
  }

  /**
   * Check up, down and enter key for change selecte ingredient
   * @param event - Key event for check
   */
  onKeyDown(event: KeyboardEvent) {
    const ingredients = this.foundIngredients();
    if (ingredients.length == 0 || this.ingredientInputRef.nativeElement != document.activeElement) return;

    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIngredientIndex = this.activeIngredientIndex < ingredients.length - 1 ? this.activeIngredientIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIngredientIndex = this.activeIngredientIndex > 0 ? this.activeIngredientIndex - 1 : ingredients.length - 1;
        break;
      case 'Enter':
        if (this.activeIngredientIndex != -1) {
          event.preventDefault();
          this.selectIngredient(ingredients[this.activeIngredientIndex]);
          this.activeIngredientIndex = -1;
        }
    }
  }
  // #endregion
}
