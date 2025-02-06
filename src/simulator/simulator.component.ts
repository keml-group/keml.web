import {Component, Input} from '@angular/core';
import {Conversation} from "../shared/models/keml/conversation";
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthorComponent} from "../editor/author/author.component";
import {ConversationPartnerComponent} from "../editor/cp/conversation-partner.component";
import {MsgComponent} from "../editor/msg/msg.component";
import {NgForOf} from "@angular/common";
import {PreknowledgeComponent} from "../editor/preknowledge/preknowledge.component";
import {TextAreaSvgComponent} from "../editor/helper/text-area-svg/text-area-svg.component";
import {SimulationService} from "../shared/services/simulation.service";
import {MatToolbar} from "@angular/material/toolbar";
import {TrustComputator} from "../shared/utility/trust-computator";

@Component({
  selector: 'app-simulator',
  standalone: true,
    imports: [
        MatIcon,
        AuthorComponent,
        ConversationPartnerComponent,
        MsgComponent,
        NgForOf,
        PreknowledgeComponent,
        TextAreaSvgComponent,
        MatToolbar
    ],
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.css'
})
export class SimulatorComponent {

  @Input() conversation!: Conversation

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>,
    public simulationService: SimulationService,
  ) {}

  close() {
    this.dialogRef.close();
  }

  currentTrusts() {
    TrustComputator.computeCurrentTrusts(this.conversation)
  }

}
