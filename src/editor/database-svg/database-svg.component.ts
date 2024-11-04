import {Component, Input} from '@angular/core';

@Component({
  selector: '[database]',
  templateUrl: './database-svg.component.svg',
  styleUrl: './database-svg.component.css'
})
export class DatabaseSvgComponent {

  @Input() stroke: string = 'black'
  @Input() fill: string = 'grey';

}
