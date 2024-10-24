import {AfterViewInit, Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {ModelIOService} from "../shared/services/model-io.service";
import {DiagramService} from "../shared/services/diagram.service";
import {IoService} from "../shared/services/io.service";
import {Conversation, ConversationPartner, Message} from "../shared/models/sequence-diagram-models";
import {MsgFormComponent} from "./msg-form/msg-form.component";
import {MatDialog} from "@angular/material/dialog";
import {ConversationPartnerDetailsComponent} from "./cp-details/cp-details.component";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [ModelIOService, DiagramService, IoService]
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
      MsgFormComponent,
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

}
