import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'header[cac-header]',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  bgGreen: InputSignal<boolean> = input<boolean>(false);
}
