import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.scss',
})
export class DropDownComponent {
  @Input() options: string[] | undefined;
  @Output() optionSelected = new EventEmitter<string>();

  selectedOption: string | undefined;

  constructor() {}

  onSelect(option: string): void {
    this.selectedOption = option;
    this.optionSelected.emit(option);
  }
}
