import {Component, Input} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {KeyValuePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'simulation-input-details',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    KeyValuePipe
  ],
  templateUrl: './simulation-input-details.component.html',
  styleUrl: './simulation-input-details.component.css'
})
export class SimulationInputDetails {

  @Input() simulationInputs!: SimulationInputs
  @Input() cps!: ConversationPartner[];

  constructor(
    private dialogRef: MatDialogRef<SimulationInputDetails>,
  ) {}

  closeMe() {
    this.dialogRef.close();
  }
}
