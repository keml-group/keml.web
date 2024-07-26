import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild,} from '@angular/core';
import {
  BpmnDiagramsService,
  DiagramComponent,
  IExportOptions
} from "@syncfusion/ej2-angular-diagrams";
import {ModelIOService} from "../shared/services/model-io.service";
import {DiagramService} from "../shared/services/diagram.service";
import {IoService} from "../shared/services/io.service";
import{Conversation} from "../shared/models/keml/conversation";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [BpmnDiagramsService, ModelIOService, DiagramService, IoService]
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild("diagram") diagram!: DiagramComponent;
  @ViewChild("kemlcanvas") canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("svg") svg!: ElementRef<SVGElement>;
  conversation: Conversation;

  constructor(
    private modelIOService: ModelIOService,
    private diagramService: DiagramService,
    private ioService: IoService,
  ) {
    this.conversation = new Conversation();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    //console.log(this.diagram);
  }

  fillColor = 'rgb(255, 0, 0)';

  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    this.fillColor = `rgb(${r}, ${g}, ${b})`;
  }


  newDiagram() {
    this.diagramService.initializeConversationDiagram(this.diagram);
  }

  newConversation(): void {
    this.conversation = new Conversation();

  }

  openKeml() {
    document.getElementById('openKEML')?.click();
  }

  loadKeml(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      const conv = this.modelIOService.loadKEML(txt);

      this.conversation = Conversation.fromJSON(txt);
      console.log(JSON.stringify(this.conversation));
      //console.log(c2.toJson());
      // throws:
      //console.log(this.conversation.author.messages.map(m => {m.toJSON()}))
      this.diagramService.loadConversationAsDiagram(conv, this.diagram)
    });
  }

  openDiagramJson() {
    document.getElementById('openDia')?.click();
  }

  loadDiagramJSON(event: Event) {
    this.ioService.loadStringFromFile(event).then(diagramStr => {
      this.diagram.loadDiagram(diagramStr);
    })
  }

  saveKeml() {
    const jsonString = JSON.stringify(this.conversation);
    const contentBlob = new Blob([jsonString], {type: 'application/json'});
    this.ioService.saveFile(contentBlob, 'keml.json');
  }

  saveDiagramJSON() {
    const jsonString = this.diagram.saveDiagram();
    const contentBlob = new Blob([jsonString], {type: 'application/json'});
    this.ioService.saveFile(contentBlob, 'diagram.json');
  }

  saveImgFromCanvas() {
    this.canvas.nativeElement.toBlob((blob => {
      if(blob)
        this.ioService.saveFile(blob, this.conversation.title+'.png');
    }), "image/png");
  }

  saveImg() {
    let options: IExportOptions = {mode: 'Download', format: 'SVG', fileName: 'keml'};
    this.diagram.exportDiagram(options);
  }

}
