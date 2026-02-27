import { Injectable } from '@angular/core';
import {KemlService} from "@app/shared/keml/edit/keml.service";
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

  loadFromFile(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      this.kemlService.loadConversation(JSON.parse(txt));
    });
  }

  save() {
    const jsonString = JSON.stringify(this.kemlService.serialize());
    this.ioService.saveJson(jsonString, this.kemlService.getTitle())
  }

}
