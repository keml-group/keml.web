import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
    selector: '[database]',
    templateUrl: './database-svg.component.svg',
    styleUrl: './database-svg.component.css',
    standalone: true
})
export class DatabaseSvgComponent implements OnInit, OnChanges {

  @Input() stroke: string = 'black'
  @Input() strokewidth: number = 0.2;
  @Input() fill: string = 'grey';
  @Input() w: number = 48;
  @Input() h: number = 15;

  path: string ='';

  ngOnInit() {
    this.path = this.computePath()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.path = this.computePath()
  }

  computePath(): string {
    const w = this.w;
    const h = this.h;
    const h1 = w/6;
    const curveHeight= w/8; //Bezier curve computation for highest point t=w/2
    const hges = h+curveHeight;

    return 'M 0 '+h1+' C 1 '+(2*h1)+' '+(w-1)+' '+(2*h1)+' '+w+' '+h1+'\n'
      +' C '+(w-1)+' 0 1 '+' 0 0 '+h1+'\n'
      +'v '+hges+'\n'
      +' C 1 '+(2*h1+hges)+' '+(w-1)+' '+(2*h1+hges)+' '+w+' '+(h1+hges)+'\n'
      +'v -'+hges;
  }
}
