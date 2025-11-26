import { Injectable } from '@angular/core';
import {KemlService} from "@app/shared/keml/edit/keml.service";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {IoService} from "ngx-emfular-helper";

@Injectable({
  providedIn: 'root'
})
export class KEMLIOService {
  // responsible for KEML laod and save:
  // it delegates the conversation

  constructor(
    private kemlService: KemlService,
    private ioService: IoService,
  ) {}

  loadKEMLfromFile(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      let convJson =  <ConversationJson>JSON.parse(txt);
      this.kemlService.loadConversation(convJson);
    });
  }

  saveKEML() {
    const jsonString = JSON.stringify(this.kemlService.serializeConversation());
    this.ioService.saveJson(jsonString, this.kemlService.getTitle())
  }

}
