import {AfterViewInit, Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {ModelIOService} from "../shared/services/model-io.service";
import {IoService} from "../shared/services/io.service";
import {Conversation} from "../shared/models/keml/conversation";
import {MatDialog} from "@angular/material/dialog";
import {Information} from "../shared/models/keml/msg-info";
import {InfoDetailsComponent} from "./info-details/info-details.component";
import {DetailsService} from "./details/service/details.service";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild("svg") svg!: ElementRef<SVGElement>;
  conversation: Conversation;

  constructor(
    public detailsService: DetailsService,
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
    this.modelIOService.addNewConversationPartner();
  }

  addMessage(isSend: boolean) {
    if (this.conversation.conversationPartners.length > 0) {
      const cp = this.conversation.conversationPartners[0];
      const msg = this.modelIOService.addNewMessage(cp, isSend);
      this.detailsService.openMessageDetails(msg);
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
