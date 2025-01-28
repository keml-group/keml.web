import {Component, Input} from '@angular/core';
import {Conversation} from "../../shared/models/keml/conversation";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.css'
})
export class SimulatorComponent {

  @Input() conv!: Conversation

}
