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
import {SimulationDialogueService} from "@app/features/simulator/simulation-dialogue.service";
import {ArrowMarkersComponent} from "@app/shared/keml/graphical/helper/arrow-styling/arrow-markers/arrow-markers.component";
import {KEMLIOService} from "@app/features/editor/keml-io.service";
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

  private cleanSVG(svg: SVGElement): Blob {
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    clonedSvg.removeAttribute('ng-version'); // remove Angular artifacts
    const svgText = new XMLSerializer().serializeToString(clonedSvg);
    return new Blob([svgText], { type: 'image/svg+xml' });
  }

  saveSVG() {
    const svgContent = this.svg.nativeElement;
    if(svgContent) {
      this.ioService.saveSVG(svgContent, this.kemlService.conversation.title)
    }
  }

  saveSVGasPNG() {
    const svgContent = this.svg.nativeElement;
    let contentBlob = this.cleanSVG(svgContent);

    this.convertSvgBlobToPngAndDownload(contentBlob, 'downloaded-image.png')
    //console.log("Todo: save SVG as PNG")
  }

  convertSvgBlobToPngAndDownload(svgBlob: Blob, fileName: string = 'image.png'): void {
    const reader = new FileReader();

    reader.onload = () => {
      const svgText = reader.result as string;
      console.log(svgText);

      const img = new Image();
      const svgBase64 = btoa(unescape(encodeURIComponent(svgText)));
      img.src = `data:image/svg+xml;base64,${svgBase64}`;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Canvas context not available');
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            console.error('Failed to convert canvas to PNG blob');
            return;
          } else {
            console.log(pngBlob);
          }

          const link = document.createElement('a');
          link.href = URL.createObjectURL(pngBlob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }, 'image/png');
      };

      img.onerror = (err) => {
        console.error('Error loading SVG image:', err);
      };
    };

    reader.onerror = (err) => {
      console.error('Error reading SVG blob:', err);
    };

    reader.readAsText(svgBlob);
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
