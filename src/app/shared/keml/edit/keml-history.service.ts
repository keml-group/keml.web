import { Injectable } from '@angular/core';
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {HistoryService} from "@app/shared/history.service";

@Injectable({
  providedIn: 'root'
})
export class KemlHistoryService extends HistoryService<ConversationJson> {
  constructor() {
    super("KEML-history_", 50);
  }
}
