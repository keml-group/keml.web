import {AfterViewInit, Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {ModelIOService} from "../shared/services/model-io.service";
import {DiagramService} from "../shared/services/diagram.service";
import {IoService} from "../shared/services/io.service";
import {Conversation} from "../shared/models/sequence-diagram-models";

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
    private diagramService: DiagramService,
    private ioService: IoService,
  ) {
    this.conversation = this.modelIOService.newKEML();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }

  fillColor = 'rgb(255, 0, 0)';

  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    this.fillColor = `rgb(${r}, ${g}, ${b})`;
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

}
