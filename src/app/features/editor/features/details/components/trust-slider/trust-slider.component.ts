import {Component, Input} from '@angular/core';

@Component({
  selector: 'trust-slider',
  imports: [],
  templateUrl: './trust-slider.component.html',
  styleUrl: './trust-slider.component.css'
})
export class TrustSliderComponent {

  @Input() trust?: number;

}
