import { Component, input, InputSignal, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Recepe } from '../../shared/classes/recepe';
import { FoodCategory } from '../../shared/enums/food-category';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'recepe-detail',
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './recepe-detail.component.html',
  styleUrl: './recepe-detail.component.scss'
})
export class RecepeDetailComponent implements OnInit{
  recepe: InputSignal<Recepe> = input.required<Recepe>();
  chefs: InputSignal<number> = input<number>(2);
  editable: InputSignal<boolean> = input<boolean>(false);

  protected recepeForm = new FormGroup({
    title: new FormControl<string>('', {validators: [Validators.required]}),
    duration: new FormControl<number>(20, {validators: [Validators.required, Validators.min(5)]}),
    energy: new FormControl<number>(0,{validators: [Validators.required, Validators.min(0)]}),
    protein: new FormControl<number>(0, {validators: [Validators.required, Validators.min(0)]}),
    fat: new FormControl<number>(0, {validators: [Validators.required, Validators.min(0)]}),
    carbs: new FormControl<number>(0, {validators: [Validators.required, Validators.min(0)]})
  })

  private chefIcons: string[] = ['one', 'two', 'three', 'four'];
  protected FoodCategory = FoodCategory;
  protected foodCategories: FoodCategory[] = [FoodCategory.VEGETARIAN, FoodCategory.VEGAN, FoodCategory.KETO, FoodCategory.ALL]
  protected selectedFoodCategory: FoodCategory = FoodCategory.ALL;

  constructor() {
    this.instandTrimTitle();
  }

  ngOnInit(): void {
    this.selectedFoodCategory = this.recepe().category;
    this.initForm();
  }

  // #region From-Action
  /** Sets start values from current recepe. */
  private initForm() {
    const recepe = this.recepe();
    this.recepeForm.setValue({
      title: recepe.title,
      duration: recepe.duration,
      energy: recepe.energy,
      protein: recepe.protein,
      fat: recepe.fat,
      carbs: recepe.carbs
    })
  }

  /** Trimms title field imedeatly. */
  private instandTrimTitle() {
    const ctrl = this.recepeForm.get('title');
    if (ctrl) {
      ctrl.valueChanges.subscribe(value => {
        if (value) {
          const trimmedValue = value.trim();
          if (value.length == 1 && value != trimmedValue
            || value[value.length-1] ==  ' ' && value[value.length-2] == ' ' && value != trimmedValue)
              ctrl.setValue(trimmedValue, { emitEvent: false })
        }
      });
    }
  }

  /**
   * Gets error-message from field.
   * @param name - Name of Field.
   * @returns Error-mesage from field.
   */
  protected errorMessage(name: string): string {
    const control = this.recepeForm.get(name);
    if (this.recepeForm.valid || !control || !control.errors) return '';
    if (control.errors['required']) return `${name.charAt(0).toUpperCase() + name.slice(1, name.length)} required.`;
    if (name == 'duration' && control.errors['min']) return 'Duration minimum 5 mins.';
    if (control.errors['min']) return `No negative ${name.charAt(0).toUpperCase() + name.slice(1, name.length)}-Values`
    return '';
  }
  // #endregion

  /**
   * Gets a list of available chefs.
   * @returns list of available chefs.
   */
  protected availableChefs(): string[] {
    const numberChefs = Math.min(this.chefs(), this.recepe().directions.length);
    return this.chefIcons.slice(0, numberChefs);
  }
}
