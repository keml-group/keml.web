import { Injectable } from '@angular/core';
import {Conversation} from "../models/sequence-diagram-models";

@Injectable({
  providedIn: 'root'
})
export class ModelIOServiceService {

  constructor() { }

  loadKEML(json: string): Conversation {
    return <Conversation>JSON.parse(json);
  }
}
