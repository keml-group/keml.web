import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TrustColorer} from "@app/shared/keml/utils/trust-colorer";
import {NumberDisplayer} from "@app/core/utils/number-displayer";

@Component({
    selector: '[trust-svg]',
    imports: [],
    templateUrl: './trust.component.svg',
    styleUrl: './trust.component.css'
})
export class TrustComponent implements OnInit, OnChanges {
  @Input() trust: number | undefined;
  @Input() w!: number;
  @Input() h!: number;
  @Input() x: number = 0;
  @Input() y: number = 0;

  color: string = '#FFFFFF';
  trust4Display: string = ''; //use to end after a certain number of digits

  ngOnInit() {
    this.determineRepresentationAndColor()
  }

  ngOnChanges() {
    this.determineRepresentationAndColor()
  }

  private determineRepresentationAndColor() {
    this.color = TrustColorer.hexColor(this.trust)
    this.trust4Display = NumberDisplayer.displayNumWith1DigitBeforeSep(this.trust)
  }

}
