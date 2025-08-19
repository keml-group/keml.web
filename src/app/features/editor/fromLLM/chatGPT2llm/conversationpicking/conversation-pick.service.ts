import { Injectable } from '@angular/core';
import {
  ConversationPickerComponent
} from "@app/features/editor/fromLLM/chatGPT2llm/conversationpicking/conversation-picker/conversation-picker.component";
import {ChatGpt2Llm} from "@app/features/editor/fromLLM/chatGPT2llm/chat-gpt-2-llm";
import {MatDialog} from "@angular/material/dialog";
import {KEMLIOService} from "@app/features/editor/services/keml-io.service";
import {IoService} from "ngx-emfular-helper";

@Injectable({
  providedIn: 'root'
})
export class ConversationPickService {

  constructor(
    private dialog: MatDialog,
    private kemlIOService: KEMLIOService,
    private ioService: IoService,
  ) { }

  startWithAllConvs(event: Event) {
    this.ioService.loadStringFromFile(event).then( (txt: string) =>
      this.openConversationPicker(ChatGpt2Llm.separateConvs(txt))
    )
  }

  openConversationPicker(jsons: any[]) {
    const dialogRef = this.dialog.open(
      ConversationPickerComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.texts = jsons;
    dialogRef.componentInstance.chosenJson.subscribe(choice => {
      let msgs = ChatGpt2Llm.parseConversationJSON(choice)
      this.kemlIOService.convFromLlmMessages(msgs)
      dialogRef.componentInstance.chosenJson.unsubscribe()
    })
  }

}
