import {Component, computed, Input, Signal} from '@angular/core';
import {Author} from "@app/shared/keml/core/author";
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { PersonSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/person-svg/person-svg.component';
import {KemlService} from "@app/shared/keml/core/keml.service";
import {LayoutingService} from "@app/shared/keml/graphical/layouting.service";

@Component({
    selector: '[authorG]',
    templateUrl: './author.component.svg',
    styleUrl: './author.component.css',
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class AuthorComponent {
  //author has fixed position and no way to change name (right now)
  @Input() author!: Author;

  lineLength: Signal<number> = computed(() =>
    this.layoutingService.determineLifeLineLength(this.kemlService.msgCount()))

  constructor(
    private kemlService: KemlService,
    private layoutingService: LayoutingService,
  ) {
  }

}
