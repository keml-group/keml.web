import {Component, ElementRef, ViewChild,} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltipModule } from "@angular/material/tooltip";
import { KemlService } from "@app/shared/keml/edit/keml.service";
import { DetailsService } from "@app/features/editor/details/details.service";
import { DatabaseSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/database-svg/database-svg.component';
import { PersonSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/person-svg/person-svg.component';
import {SimulationDialogueService} from "@app/features/simulator/simulation-dialogue.service";
import {KEMLIOService} from "@app/features/editor/keml-io.service";
import {ConversationPickService} from "@app/features/fromLLM/chatGPT2llm/conversationpicking/conversation-pick.service";
import {IoService, InputHandler} from "ngx-emfular-helper";
import {ConversationComponent} from "@app/shared/keml/graphical/conversation/conversation.component";
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";


@Component({
    selector: 'keml-editor',
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.css',
  imports: [MatTooltipModule, MatToolbar, MatIcon, PersonSvgComponent, DatabaseSvgComponent, ConversationComponent]
})
export class EditorComponent {

  @ViewChild("svg") svg!: ElementRef<SVGElement>;

  convLength: number = 150
  convWidth: number = 1000;

  constructor(
    public detailsService: DetailsService,
    public history: KemlHistoryService,
    public kemlIOService: KEMLIOService,
    public kemlService: KemlService,
    public conversationPickService: ConversationPickService,
    private simulationService: SimulationDialogueService,
    private ioService: IoService,
  ) {}

  updateConvLength(event: number) {
    this.convLength = Math.max(event, 1000)
  }

  updateConvWidth(event: number) {
    this.convWidth = event
  }

  saveSVG() {
    const svgContent = this.svg.nativeElement;
    if(svgContent) {
      this.ioService.saveSVG(svgContent, this.kemlService.conversation.title)
    }
  }

  saveSVGasPNG() {
    const svgContent = this.svg.nativeElement;
    if(svgContent) {
      this.ioService.saveSvgAsPng(svgContent, this.kemlService.conversation.title)
    }
  }

  saveSVGasJPEG() {
    const svgContent = this.svg.nativeElement;
    if(svgContent) {
      this.ioService.saveSvgAsJpeg(svgContent, this.kemlService.conversation.title)
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
