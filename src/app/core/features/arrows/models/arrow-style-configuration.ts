import {ArrowHead} from "@app/core/features/arrows/models/arrow-heads";

export interface ArrowStyleConfiguration {
  color: string;
  dashed: number[];
  //style?: string

  //startPointer?: SVGMarkerElement;
  //endPointer?: SVGMarkerElement;
  endPointer?: ArrowHead; //coudl use string as well
}
