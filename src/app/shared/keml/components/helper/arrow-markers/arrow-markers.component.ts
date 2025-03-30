import { Component } from '@angular/core';
import {ArrowHead} from "@app/shared/keml/models/arrow-heads";

@Component({
  selector: '[arrow-markers]',
  standalone: true,
  imports: [],
  templateUrl: './arrow-markers.component.svg',
  styleUrl: './arrow-markers.component.css'
})
export class ArrowMarkersComponent {

  protected readonly ArrowHead = ArrowHead;
}
