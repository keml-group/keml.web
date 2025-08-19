import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatGpt2LlmService} from "@app/features/editor/fromLLM/chatGPT2llm/chat-gpt-2-llm.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {NgFor} from "@angular/common";

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
  @Output() chosenJson: EventEmitter<any> = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<ConversationPickerComponent>,
    private chatGpt2LlmService: ChatGpt2LlmService,
  ) {}


  ngOnInit() {
    this.texts = this.chatGpt2LlmService.separateConvs(this.convArray);
    this.titles = this.chatGpt2LlmService.getTitlesFromJsonArray(this.texts)
  }

  chooseConversation(index: number) {
    this.chosenJson.emit(this.texts[index])
    this.dialogRef.close();
  }

  closeMe() {
    this.dialogRef.close();
  }

}
