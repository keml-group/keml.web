import {Component, Input} from '@angular/core';
import {Information} from "../../shared/models/knowledge-models";

@Component({
  selector: '[infoG]',
  templateUrl: './info.component.svg',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  @Input() info!: Information;

  //todo: into info?
  x=0;
  y=0;
  w=200
  h=50

  protected readonly outerWidth = outerWidth;
  protected readonly innerWidth = innerWidth;
}
