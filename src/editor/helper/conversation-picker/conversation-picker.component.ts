import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatGptConv2LlmMessages} from "../../../shared/models/llm/chat-gpt-conv2-llm-messages";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-conversation-picker',
  templateUrl: './conversation-picker.component.html',
  styleUrl: './conversation-picker.component.css'
})
export class ConversationPickerComponent implements OnInit {

  @Input() texts!: any[];
  @Output() chosenJson: EventEmitter<any> = new EventEmitter();
  titles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ConversationPickerComponent>,
  ) {}


  ngOnInit() {
    this.titles = ChatGptConv2LlmMessages.getTitlesFromJsonArray(this.texts)
  }

  chooseConversation(index: number) {
    this.chosenJson.emit(this.texts[index])
    this.dialogRef.close();
  }

  closeMe() {
    this.dialogRef.close();
  }

}
