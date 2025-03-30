import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
    selector: '[person]',
    templateUrl: './person-svg.component.svg',
    styleUrl: './person-svg.component.css',
    standalone: true
})
export class PersonSvgComponent implements OnInit, OnChanges {

  @Input() stroke: string = 'black'
  @Input() strokewidth: number = 0.2;
  @Input() fill: string = 'none';
  @Input() w: number = 40;
  @Input() h: number = 70;

  path: string = '';

  ngOnInit(): void {
    this.path = this.computePath()
  }

  ngOnChanges(): void {
    this.path = this.computePath()
  }

  computePath(): string {
    const w= this.w;
    const h= this.h;
    const midW = w/2;
    const circleH = w/2;
    const remainingH = h - circleH;

    return 'M '+midW+' '+circleH+' l '+0+' '+ (remainingH*2/3) //body
      +' L 0 '+h + '\n' //first leg
      + 'm '+midW+' '+ -remainingH/3+' L '+w+' '+h+'\n' //second leg
      +'M 0 '+(circleH+remainingH/5)+' h '+w; //arms
  }
}
