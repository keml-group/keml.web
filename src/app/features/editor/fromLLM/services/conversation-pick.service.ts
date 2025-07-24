import { Injectable } from '@angular/core';
import {
  ConversationPickerComponent
} from "@app/features/editor/fromLLM/components/conversation-picker/conversation-picker.component";
import {ChatGptConv2LlmMessages} from "@app/features/editor/fromLLM/utils/chat-gpt-conv2-llm-messages";
import {MatDialog} from "@angular/material/dialog";
import {KEMLIOService} from "@app/features/editor/services/keml-io.service";
import {IoService} from "@app/core/services/io.service";

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
      this.openConversationPicker(ChatGptConv2LlmMessages.separateConvs(txt))
    )
  }

  openConversationPicker(jsons: any[]) {
    const dialogRef = this.dialog.open(
      ConversationPickerComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.texts = jsons;
    dialogRef.componentInstance.chosenJson.subscribe(choice => {
      let msgs = ChatGptConv2LlmMessages.parseConversationJSON(choice)
      this.kemlIOService.convFromLlmMessages(msgs)
      dialogRef.componentInstance.chosenJson.unsubscribe()
    })
  }

}
