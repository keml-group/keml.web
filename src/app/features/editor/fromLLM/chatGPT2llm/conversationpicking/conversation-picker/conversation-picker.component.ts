import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatGpt2LlmService} from "@app/features/editor/fromLLM/chatGPT2llm/chat-gpt-2-llm.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {NgFor} from "@angular/common";
import {LLMMessage} from "@app/features/editor/fromLLM/llm2keml/llm.models";

@Component({
    selector: 'app-conversation-picker',
    templateUrl: './conversation-picker.component.html',
    styleUrl: './conversation-picker.component.css',
    imports: [MatIcon, NgFor]
})
export class ConversationPickerComponent implements OnInit {

  @Input() convArray!: any;
  texts: any[] = [];
  titles: string[] = [];
  @Output() msgs: EventEmitter<LLMMessage[]> = new EventEmitter<LLMMessage[]>();

  constructor(
    private dialogRef: MatDialogRef<ConversationPickerComponent>,
    private chatGpt2LlmService: ChatGpt2LlmService,
  ) {}


  ngOnInit() {
    this.texts = this.chatGpt2LlmService.separateConvs(this.convArray);
    this.titles = this.chatGpt2LlmService.getTitlesFromJsonArray(this.texts)
  }

  chooseConversation(index: number) {
    let msgs = this.chatGpt2LlmService.parseConversationJSON(this.texts[index])
    this.msgs.emit(msgs)
    this.dialogRef.close();
  }

  closeMe() {
    this.dialogRef.close();
  }

}
