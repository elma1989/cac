import { Component, computed, ElementRef, input, InputSignal, output, OutputEmitterRef, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { RecepeIngredient } from '../../../../shared/classes/recepe-ingredient';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ingredient } from '../../../../shared/classes/ingredient';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs';
import { BaseUnit } from '../../../../shared/classes/types';
import { EditState } from '../../../../shared/enums/edit-state';

type FormData = {
  amount: number;
  unit: BaseUnit;
  name: string
}

@Component({
  selector: 'ingredient-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './ingredient-edit.component.html',
  styleUrl: './ingredient-edit.component.scss'
})
export class IngredientEditComponent {
  ingredient: InputSignal<RecepeIngredient> = input.required<RecepeIngredient>();
  ingredients: InputSignal<Ingredient[]> = input<Ingredient[]>([]);

  edit: OutputEmitterRef<RecepeIngredient> = output<RecepeIngredient>();
  changedIngredient: OutputEmitterRef<RecepeIngredient> = output<RecepeIngredient>();

  protected editForm = new FormGroup({
    amount: new FormControl(0, {validators: [Validators.required, Validators.min(1)]}),
    unit: new FormControl('g'),
    name: new FormControl('', {validators: [Validators.required, Validators.minLength(2)]})
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

  // #region Formactions
  /** Enables edit mode. */
  enableEdit() {
    const ing = this.ingredient();
    this.editForm.setValue({
      amount: ing.amount,
      unit: ing.ingredient.unit,
      name: ing.ingredient.name
    })
    this.edit.emit(this.ingredient());
  }

  /** Deletes an ingredient. */
  deleteIngredient() {
    const ing = this.ingredient();
    ing.state = EditState.DELETED;
    ing.editMode = false;
    this.changedIngredient.emit(ing);
  }

  /**
   * creates an ingredient not yet exists.
   * @param name - Name of ingredient.
   * @param unit - Unit of incredient.
   * @returns Instace of Ingredient
   */
  private createUnknonIngredient(name: string, unit: BaseUnit): Ingredient {
    const ing = new Ingredient({
      id: '',
      name: name,
      unit: unit
    });
    ing.state = EditState.CREATED;
    return ing;
  }

  /**
   * Changed values of ingredient.
   * @param ingredient - Ingredient forr change.
   * @param amount - New amount of ingredient.
   * @param unit - New unit of ingredient.
   * @param change - change state before.
   * @returns True, if ingredient has been changed.
   */
  private changeIngredientValues(ingredient: RecepeIngredient, amount: number, unit: BaseUnit, change: boolean): boolean {
    if (ingredient.amount != amount || ingredient.ingredient.unit != unit) {
      ingredient.amount = amount;
      ingredient.ingredient.unit;
      change = true;
    }
    return change;
  }

  /**
   * changes an ingredient by user input.
   * @param formData - Data in inputfields.
   */
  private changeIngredient(formData: FormData) {
    const recIng = this.ingredient();
    let change = false;
    const temp = this.ingredients().find(ing => ing.name.toLowerCase() == formData.name?.trim().toLowerCase());
    if (temp) {
      if (temp != recIng.ingredient) {
        recIng.ingredient = temp;
        change = true;
      }
    } else {
      recIng.ingredient = this.createUnknonIngredient(formData.name, formData.unit);
      change = true;
    }
    change = this.changeIngredientValues(recIng, formData.amount, formData.unit, change);
    if (change && recIng.state == EditState.DEFAULT) recIng.state = EditState.EDITED;
  }

  /** Submit action for changes. */
  onSubmitChanges() {
    const ing = this.ingredient();
    const formData = this.editForm.value;
    if (formData.amount
      && formData.unit
      && formData.name
      && this.editForm.valid
    ) this.changeIngredient(formData as FormData);
    ing.editMode = false;
    this.changedIngredient.emit(ing);
  }
  // #endregion
}
