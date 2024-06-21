export class Message {
  isSend: boolean; // distinguishes KEML's Send and Receive Messages
  content: string;
  originalContent: string;
  timing: number; //int! todo

  constructor(isSend: boolean, content: string, originalContent: string, timing: number) {
    this.isSend = isSend;
    this.content = content;
    this.originalContent = originalContent;
    this.timing = timing;
  }


}


