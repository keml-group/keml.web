import {Component, ElementRef, ViewChild,} from '@angular/core';
import {ModelIOService} from "../shared/services/model-io.service";
import {IoService} from "../shared/services/io.service";
import {Conversation} from "../shared/models/keml/conversation";
import {DetailsService} from "./details/service/details.service";
import {ChatGptConv2LlmMessages} from "../shared/models/llm/chat-gpt-conv2-llm-messages";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  @ViewChild("svg") svg!: ElementRef<SVGElement>;
  conversation: Conversation;

  constructor(
    public detailsService: DetailsService,
    public modelIOService: ModelIOService,
    private ioService: IoService,
  ) {
    this.conversation = this.modelIOService.newKEML();
  }

  newConversation(): void {
    this.conversation = this.modelIOService.newKEML();
  }

  newFromChatGpt(): void {
    document.getElementById('openChatGptConv')?.click();
  }

  startWithMsgs(event: Event): void {
    this.ioService.loadStringFromFile(event).then(txt => {
      let msgs = ChatGptConv2LlmMessages.parseConversation(txt)
      console.log(msgs);
      this.conversation = this.modelIOService.convFromLlmMessages(msgs)
    })
  }

  openKeml() {
    document.getElementById('openKEML')?.click();
  }

  loadKeml(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      this.conversation = this.modelIOService.loadKEML(txt);
    });
  }

  saveKeml() {
    const jsonString = this.modelIOService.saveKEML(this.conversation);
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
