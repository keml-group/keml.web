import {Component, ElementRef, ViewChild,} from '@angular/core';
import { NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltipModule } from "@angular/material/tooltip";
import { KemlService } from "@app/features/editor/services/keml.service";
import { IoService } from "@app/core/services/io.service";
import { DetailsService } from "@app/features/editor/details/services/details.service";
import { MsgComponent } from '@app/shared/keml/components/msg/msg.component';
import { PreknowledgeComponent } from '@app/shared/keml/components/preknowledge/preknowledge.component';
import { ConversationPartnerComponent } from '@app/shared/keml/components/cp/conversation-partner.component';
import { AuthorComponent } from '@app/shared/keml/components/author/author.component';
import { TextAreaSvgComponent } from '@app/core/components/text-area-svg/text-area-svg.component';
import { DatabaseSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/database-svg/database-svg.component';
import { PersonSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/person-svg/person-svg.component';
import {SimulationService} from "@app/features/simulator/services/simulation.service";
import {ArrowMarkersComponent} from "@app/shared/keml/components/helper/arrow-markers/arrow-markers.component";
import {KEMLIOService} from "@app/features/editor/services/keml-io.service";
import {InputHandler} from "@app/core/utils/input-handler";
import {ConversationPickService} from "@app/features/editor/fromLLM/services/conversation-pick.service";


@Component({
    selector: 'keml-editor',
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.css',
    imports: [MatTooltipModule, MatToolbar, MatIcon, PersonSvgComponent, DatabaseSvgComponent, TextAreaSvgComponent, AuthorComponent, NgFor, ConversationPartnerComponent, PreknowledgeComponent, MsgComponent, ArrowMarkersComponent]
})
export class EditorComponent {

  @ViewChild("svg") svg!: ElementRef<SVGElement>;

  constructor(
    public detailsService: DetailsService,
    public kemlIOService: KEMLIOService,
    public kemlService: KemlService,
    public conversationPickService: ConversationPickService,
    private simulationService: SimulationService,
    private ioService: IoService,
  ) {
    this.kemlIOService.newKEML();
  }

  //todo: handling of foreign objects leads to errors, will need self-written method
  saveSVG() {
    const svgContent = this.svg.nativeElement;
    if(svgContent) {
      this.ioService.saveSVG(svgContent, this.kemlService.conversation.title)
    }
  }

  openKeml() {
    document.getElementById('openKEML')?.click();
  }

  newFromChatGPTList() {
    document.getElementById('openChatGptConvList')?.click();
  }

  openSimulation() {
    this.simulationService.openSimulationDialog(this.kemlService.conversation)
  }

  addConversationPartner() {
    const cp = this.kemlService.addNewConversationPartner();
    this.detailsService.openConversationPartnerDetails(cp)
  }

  addMessage(isSend: boolean) {
    const msg = this.kemlService.addNewMessage(isSend);
    if (msg)
      this.detailsService.openMessageDetails(msg);
  }

  addNewInfo() {
    const newInfo = this.kemlService.addNewNewInfo()
    if (newInfo)
      this.detailsService.openInfoDetails(newInfo);
  }

  addPreknowledge() {
    const pre = this.kemlService.addNewPreknowledge();
    this.detailsService.openInfoDetails(pre);
  }

  protected readonly InputHandler = InputHandler;
}
