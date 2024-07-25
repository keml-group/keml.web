import { Injectable } from '@angular/core';
import {Conversation} from "../models/keml/conversation";

@Injectable({
  providedIn: 'root'
})
export class KemlDrawService {

  constructor() { }

  draw(context: CanvasRenderingContext2D, conv: Conversation) {

  }
}
