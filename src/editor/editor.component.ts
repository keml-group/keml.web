import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild,} from '@angular/core';
import {
  BpmnDiagramsService,
  DiagramComponent,
  IExportOptions
} from "@syncfusion/ej2-angular-diagrams";
import {ModelIOService} from "../shared/services/model-io.service";
import {DiagramService} from "../shared/services/diagram.service";
import {IoService} from "../shared/services/io.service";
//import {Author, Conversation} from "../shared/models/sequence-diagram-models";
import{Conversation} from "../shared/models/keml/conversation";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [BpmnDiagramsService, ModelIOService, DiagramService, IoService]
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild("diagram") diagram!: DiagramComponent;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //console.log(this.diagram);
  }

  constructor(
    private modelIOService: ModelIOService,
    private diagramService: DiagramService,
    private ioService: IoService,
  ) {}

  newDiagram() {
    this.diagramService.initializeConversationDiagram(this.diagram);
  }

  openKeml() {
    document.getElementById('openKEML')?.click();
  }

  loadKeml(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      const conv = this.modelIOService.loadKEML(txt);

      const c2: Conversation = Conversation.fromJSON(txt);
      console.log(JSON.stringify(c2));
      //console.log(c2.toJson());
      console.log(c2.author.messages.map(m => {m.toJSON()}))

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
    const jsonString = 'todo';
    const contentBlob = new Blob([jsonString], {type: 'application/json'});
    this.ioService.saveFile(contentBlob, 'keml.json');
  }

  saveDiagramJSON() {
    const jsonString = this.diagram.saveDiagram();
    const contentBlob = new Blob([jsonString], {type: 'application/json'});
    this.ioService.saveFile(contentBlob, 'diagram.json');
  }

  saveImg() {
    let options: IExportOptions = {mode: 'Download', format: 'SVG', fileName: 'keml'};
    this.diagram.exportDiagram(options);
  }

}
