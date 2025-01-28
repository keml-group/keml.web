import {Component, Input} from '@angular/core';
import {Conversation} from "../../shared/models/keml/conversation";
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from "@angular/material/dialog";

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

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }

}
