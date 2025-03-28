import { Component } from '@angular/core';
import {ArrowHead} from "@app/core/features/arrows/models/arrow-heads";

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
