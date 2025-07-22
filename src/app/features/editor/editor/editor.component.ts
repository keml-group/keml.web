import {Component, ElementRef, ViewChild,} from '@angular/core';
import { NgFor } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltipModule } from "@angular/material/tooltip";
import { ModelIOService } from "@app/features/editor/services/model-io.service";
import { IoService } from "@app/core/services/io.service";
import { DetailsService } from "@app/features/editor/details/services/details.service";
import { ChatGptConv2LlmMessages } from "@app/features/editor/fromLLM/utils/chat-gpt-conv2-llm-messages";
import { MsgComponent } from '@app/shared/keml/components/msg/msg.component';
import { PreknowledgeComponent } from '@app/shared/keml/components/preknowledge/preknowledge.component';
import { ConversationPartnerComponent } from '@app/shared/keml/components/cp/conversation-partner.component';
import { AuthorComponent } from '@app/shared/keml/components/author/author.component';
import { TextAreaSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/text-area-svg/text-area-svg.component';
import { DatabaseSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/database-svg/database-svg.component';
import { PersonSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/person-svg/person-svg.component';
import {ConversationPickerComponent} from '@app/features/editor/fromLLM/components/conversation-picker/conversation-picker.component';
import {SimulationService} from "@app/features/simulator/services/simulation.service";
import {ArrowMarkersComponent} from "@app/shared/keml/components/helper/arrow-markers/arrow-markers.component";
import {KEMLIOService} from "@app/features/editor/services/keml-io.service";


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
    public modelIOService: ModelIOService,
    private simulationService: SimulationService,
    private ioService: IoService,
    private dialog: MatDialog,
  ) {
    this.kemlIOService.newKEML();
  }

  newConversation(): void {
    this.kemlIOService.newKEML();
  }

  newFromChatGpt(): void {
    document.getElementById('openChatGptConv')?.click();
  }

  // this needs to be called on all input elements to allow them to accept the same value twice
  clearElem(event: Event) {
    let target = event.target as HTMLInputElement;
    target.value = ''
  }

  newFromChatGptList() {
    document.getElementById('openChatGptConvList')?.click();
  }

  startWithAllConvs(event: Event) {
    this.ioService.loadStringFromFile(event).then( (txt: string) =>
      this.openConversationPicker(ChatGptConv2LlmMessages.separateConvs(txt))
    )
  }

  openConversationPicker(jsons: any[]) {
    const dialogRef = this.dialog.open(
      ConversationPickerComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.texts = jsons;
    dialogRef.componentInstance.chosenJson.subscribe(choice => {
      let msgs = ChatGptConv2LlmMessages.parseConversationJSON(choice)
      this.kemlIOService.convFromLlmMessages(msgs)
      dialogRef.componentInstance.chosenJson.unsubscribe()
    })
  }


  startWithMsgs(event: Event): void {
    this.ioService.loadStringFromFile(event).then(txt => {
      let msgs = ChatGptConv2LlmMessages.parseConversation(txt)
      this.kemlIOService.convFromLlmMessages(msgs)
    })
  }

  openKeml() {
    document.getElementById('openKEML')?.click();
  }

  loadKeml(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      this.kemlIOService.loadKEML(txt);
    });
  }

  saveKeml() {
    const jsonString = this.kemlIOService.saveKEML(this.modelIOService.conversation);
    const contentBlob = new Blob([jsonString], {type: 'application/json'});
    this.ioService.saveFile(contentBlob, 'keml.json');
  }

  //todo: handling of foreign objects leads to errors, will need self-written method
  saveSVG() {
    const svgContent = this.svg.nativeElement;
    if(svgContent) {
      const contentBlob = new Blob([svgContent.outerHTML], {type: 'image/svg+xml'});
      this.ioService.saveFile(contentBlob, 'conversation.svg');
    }
  }

  openSimulation() {
    this.simulationService.openSimulationDialog(this.modelIOService.conversation)
  }

  addConversationPartner() {
    const cp = this.modelIOService.addNewConversationPartner();
    this.detailsService.openConversationPartnerDetails(cp)
  }

  addMessage(isSend: boolean) {
    const msg = this.modelIOService.addNewMessage(isSend);
    if (msg)
      this.detailsService.openMessageDetails(msg);
  }

  addNewInfo() {
    const newInfo = this.modelIOService.addNewNewInfo()
    if (newInfo)
      this.detailsService.openInfoDetails(newInfo);
  }

  addPreknowledge() {
    const pre = this.modelIOService.addNewPreknowledge();
    this.detailsService.openInfoDetails(pre);
  }

}
