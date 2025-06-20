import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'trust-slider',
  imports: [
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './trust-slider.component.html',
  styleUrl: './trust-slider.component.css'
})
export class TrustSliderComponent {

  @Input() trust?: number;
  @Output() trustChange = new EventEmitter<number|undefined>();

  changeT($event?: number) {
    this.trustChange.emit($event);
  }

}
