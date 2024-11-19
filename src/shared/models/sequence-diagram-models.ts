import {Information, Preknowledge, NewInformation} from "./knowledge-models";
import {Ref} from "./keml/parser/ref";

export interface Conversation {
  eClass: string;
  title: string;
  author: Author;
  conversationPartners: (ConversationPartner)[];
}

interface LifeLine {
  name: string;
  xPosition: number; //int todo
  eClass: string;
}

export interface ConversationPartner extends LifeLine {
  color?: number; // todo
  $ref?: string; //only for parsing, not clean
}

export interface Author extends LifeLine {
  messages: Message[];
  preknowledge: Preknowledge[];
}
export interface Message {
  eClass: string;
  content: string;
  originalContent?: string;
  timing: number;
  counterPart: Ref;
}

export interface SendMessage extends Message {
  uses?: Ref[];
}

export interface ReceiveMessage extends Message {
  generates: (NewInformation)[];
  repeats?: (Ref)[];
  isInterrupted: boolean;
}


