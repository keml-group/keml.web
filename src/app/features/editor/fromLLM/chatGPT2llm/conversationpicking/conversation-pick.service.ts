import { Injectable } from '@angular/core';
import {
  ConversationPickerComponent
} from "@app/features/editor/fromLLM/chatGPT2llm/conversationpicking/conversation-picker/conversation-picker.component";
import {ChatGpt2LlmService} from "@app/features/editor/fromLLM/chatGPT2llm/chat-gpt-2-llm.service";
import {MatDialog} from "@angular/material/dialog";
import {IoService} from "ngx-emfular-helper";
import {Llm2KemlService} from "@app/features/editor/fromLLM/llm2keml/llm-2-keml.service";

@Injectable({
  providedIn: 'root'
})
export class ConversationPickService {

  constructor(
    private dialog: MatDialog,
    private llm2KemlService: Llm2KemlService,
    private ioService: IoService,
  ) { }

  startWithAllConvs(event: Event) {
    this.ioService.loadStringFromFile(event).then( (txt: string) =>
      this.openConversationPicker(ChatGpt2LlmService.separateConvs(txt))
    )
  }

  openConversationPicker(jsons: any[]) {
    const dialogRef = this.dialog.open(
      ConversationPickerComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.texts = jsons;
    dialogRef.componentInstance.chosenJson.subscribe(choice => {
      let msgs = ChatGpt2LlmService.parseConversationJSON(choice)
      this.llm2KemlService.convFromLlmMessages(msgs)
      dialogRef.componentInstance.chosenJson.unsubscribe()
    })
  }

}
