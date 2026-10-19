import { Component, input, InputSignal } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Recepe } from '../../shared/classes/recepe';
import { FoodCategory } from '../../shared/enums/food-category';

@Component({
  selector: 'recepe-detail',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './recepe-detail.component.html',
  styleUrl: './recepe-detail.component.scss'
})
export class RecepeDetailComponent {
  recepe: InputSignal<Recepe> = input.required<Recepe>();
  chefs: InputSignal<number> = input<number>(2);
  editable: InputSignal<boolean> = input<boolean>(false);

  private chefIcons: string[] = ['one', 'two', 'three', 'four'];
  protected FoodCategory = FoodCategory;

  protected availableChefs(): string[] {
    const numberChefs = Math.min(this.chefs(), this.recepe().directions.length);
    return this.chefIcons.slice(0, numberChefs);
  }
}
