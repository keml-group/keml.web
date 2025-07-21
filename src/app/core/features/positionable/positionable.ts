import {BoundingBox} from "ngx-svg-graphics";
import {Identifiable} from "@app/core/features/positionable/identifiable";

export interface Positionable {
  position: BoundingBox
}

export type Draggable = Positionable & Identifiable;
