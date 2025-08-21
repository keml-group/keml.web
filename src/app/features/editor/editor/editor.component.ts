import {Component, ElementRef, ViewChild,} from '@angular/core';
import { NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltipModule } from "@angular/material/tooltip";
import { KemlService } from "@app/shared/keml/core/keml.service";
import { DetailsService } from "@app/features/editor/details/details.service";
import { MsgComponent } from '@app/shared/keml/graphical/msg/msg.component';
import { PreknowledgeComponent } from '@app/shared/keml/graphical/preknowledge/preknowledge.component';
import { ConversationPartnerComponent } from '@app/shared/keml/graphical/cp/conversation-partner.component';
import { AuthorComponent } from '@app/shared/keml/graphical/author/author.component';
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { DatabaseSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/database-svg/database-svg.component';
import { PersonSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/person-svg/person-svg.component';
import {SimulationDialogueService} from "@app/features/simulator/services/simulation-dialogue.service";
import {ArrowMarkersComponent} from "@app/shared/keml/graphical/helper/arrow-styling/arrow-markers/arrow-markers.component";
import {KEMLIOService} from "@app/features/editor/services/keml-io.service";
import {ConversationPickService} from "@app/features/fromLLM/chatGPT2llm/conversationpicking/conversation-pick.service";
import {IoService, InputHandler} from "ngx-emfular-helper";


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
    private simulationService: SimulationDialogueService,
    private ioService: IoService,
  ) {
    this.kemlService.newConversation();
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
