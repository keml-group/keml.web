import {Information, Preknowledge, NewInformation} from "./knowledge-models";

export interface Conversation {
  eClass: string;
  title: string;
  author: Author;
  conversationPartners: (ConversationPartner)[];
}

interface LifeLine {
  name: string;
  xPosition: number; //int todo
}

export interface ConversationPartner extends LifeLine {
  color?: number; // todo
  $ref?: string; //only for parsing, not clean
}

export interface Author extends LifeLine {
  messages: Message[];
  preknowledge?: Preknowledge[] | null;
}
export interface Message {
  eClass: string;
  content: string;
  originalContent?: string;
  timing: number;
  counterPart: ConversationPartner;
}

export interface SendMessage extends Message {
  uses?: Information[];
}

export interface ReceiveMessage extends Message {
  generates?: (NewInformation)[];
  repeats?: (Information)[];
}

// todo should be used to construct a reference
export interface Reference {
  eClass: string;
  $ref: string;
}


