import {AfterViewInit, Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {ModelIOService} from "../shared/services/model-io.service";
import {IoService} from "../shared/services/io.service";
import {Conversation} from "../shared/models/keml/conversation";
import {ConversationPartner} from "../shared/models/keml/conversation-partner";
import {Message} from "../shared/models/keml/msg-info";
import {MsgDetailsComponent} from "./msg-details/msg-details.component";
import {MatDialog} from "@angular/material/dialog";
import {ConversationPartnerDetailsComponent} from "./cp-details/cp-details.component";
import {Information} from "../shared/models/keml/msg-info";
import {InfoDetailsComponent} from "./info-details/info-details.component";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [ModelIOService, IoService]
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild("svg") svg!: ElementRef<SVGElement>;
  conversation: Conversation;

  constructor(
    private modelIOService: ModelIOService,
    private ioService: IoService,
    private dialog: MatDialog,
  ) {
    this.conversation = this.modelIOService.newKEML();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }

  newConversation(): void {
    this.conversation = this.modelIOService.newKEML();
  }

  openKeml() {
    document.getElementById('openKEML')?.click();
  }

  loadKeml(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      this.conversation = this.modelIOService.loadKEML(txt);
      console.log(JSON.stringify(this.conversation));
    });
  }

  saveKeml() {
    const jsonString = JSON.stringify(this.conversation);
    const contentBlob = new Blob([jsonString], {type: 'application/json'});
    this.ioService.saveFile(contentBlob, 'keml.json');
  }

  //todo: handling of foreign objects leads to errors, will need self-written method
  saveSVG() {
    const svgContent = this.svg.nativeElement;
    console.log(svgContent);
    console.log(svgContent.outerHTML);
    if(svgContent) {
      const contentBlob = new Blob([svgContent.outerHTML], {type: 'image/svg+xml'});
      this.ioService.saveFile(contentBlob, 'conversation.svg');
    }
  }

  addConversationPartner() {
    this.modelIOService.addNewConversationPartner(this.conversation.conversationPartners);
  }

  openConversationPartnerDetails(cp: ConversationPartner) {
    const dialogRef = this.dialog.open(
      ConversationPartnerDetailsComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.cp = cp;
    dialogRef.componentInstance.cps = this.conversation.conversationPartners;
    dialogRef.componentInstance.openOtherDetails.subscribe(c => {
      this.openConversationPartnerDetails(c);
    })
  }

  openMessageDetails(msg: Message) {
    const dialogRef = this.dialog.open(
      MsgDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.msg = msg;
    dialogRef.componentInstance.msgs = this.conversation.author.messages;
    dialogRef.componentInstance.cps = this.conversation.conversationPartners;
    dialogRef.componentInstance.openOtherDetails.subscribe(m => this.openMessageDetails(m))
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }

  addMessage(isSend: boolean) {
    if (this.conversation.conversationPartners.length > 0) {
      const cp = this.conversation.conversationPartners[0];
      const msg = this.modelIOService.addNewMessage(cp, isSend, this.conversation.author.messages);
      this.openMessageDetails(msg);
    } else {
      console.error('No conversation partners found');
    }
  }

  openInfoDetails(info: Information) {
    const dialogRef = this.dialog.open(
      InfoDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.info = info;
    dialogRef.componentInstance.infos = this.modelIOService.findInfoList(info, this.conversation.author.preknowledge, this.conversation.author.messages); // todo
    dialogRef.componentInstance.openOtherDetails.subscribe(i => this.openInfoDetails(i))
  }

  addNewInfo() {
    const rec = this.modelIOService.getFirstReceive(this.conversation.author.messages);
    if (rec) {
      const newInfo = this.modelIOService.addNewNewInfo(rec)
      this.openInfoDetails(newInfo);
    } else {
      console.error('No receive messages found');
    }
  }

  addPreknowledge() {
    const pre = this.modelIOService.addNewPreknowledge(this.conversation.author.preknowledge);
    this.openInfoDetails(pre);
  }

}
