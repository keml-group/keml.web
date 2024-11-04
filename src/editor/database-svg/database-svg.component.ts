import {Component, Input} from '@angular/core';

@Component({
  selector: '[database]',
  templateUrl: './database-svg.component.svg',
  styleUrl: './database-svg.component.css'
})
export class DatabaseSvgComponent {

  @Input() stroke: string = 'black'
  @Input() strokewidth: number = 0.2;
  @Input() fill: string = 'grey';
  @Input() w: number = 300;
  @Input() h: number = 150;

}
