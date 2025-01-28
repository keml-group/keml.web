import {Component, Input} from '@angular/core';
import {Conversation} from "../../shared/models/keml/conversation";

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [],
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.css'
})
export class SimulatorComponent {

  @Input() conv!: Conversation

}
