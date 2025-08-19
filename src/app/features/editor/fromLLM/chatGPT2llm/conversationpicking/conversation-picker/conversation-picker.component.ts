import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatGpt2Llm} from "@app/features/editor/fromLLM/chatGPT2llm/chat-gpt-2-llm";
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

  @Input() texts!: any[];
  @Output() chosenJson: EventEmitter<any> = new EventEmitter();
  titles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ConversationPickerComponent>,
  ) {}


  ngOnInit() {
    this.titles = ChatGpt2Llm.getTitlesFromJsonArray(this.texts)
  }

  chooseConversation(index: number) {
    this.chosenJson.emit(this.texts[index])
    this.dialogRef.close();
  }

  closeMe() {
    this.dialogRef.close();
  }

}
