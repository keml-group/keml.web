import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";

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
export class SimulationInputDetails implements OnInit {

  @Input() simulationInputs!: SimulationInputs
  partnerList: ConversationPartner[] = []
  defaultList: (number|undefined)[] = []

  constructor(
    private dialogRef: MatDialogRef<SimulationInputDetails>,
  ) {}

  ngOnInit() {
    this.partnerList = Array.from(this.simulationInputs.defaultsPerCp.keys())
    this.defaultList = Array.from(this.simulationInputs.defaultsPerCp.values())
  }

  useListsForSimInputs(cp: ConversationPartner, val: (number| undefined)) {
    this.simulationInputs.defaultsPerCp.set(cp, val)
  }

  closeMe() {
    this.dialogRef.close();
  }
}
