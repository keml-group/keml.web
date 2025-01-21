import {PreknowledgeJson, NewInformationJson} from "./knowledge-models";
import {Ref} from "../../parser/ref";

export interface ConversationJson {
  eClass: string;
  title: string;
  author: AuthorJson;
  conversationPartners: (ConversationPartnerJson)[];
}

interface LifeLineJson {
  name: string;
  xPosition: number; //int todo
  eClass: string;
}

export interface ConversationPartnerJson extends LifeLineJson {
  color?: number; // todo
  $ref?: string; //only for parsing, not clean
}

export interface AuthorJson extends LifeLineJson {
  messages: MessageJson[];
  preknowledge: PreknowledgeJson[];
}
export interface MessageJson {
  eClass: string;
  content: string;
  originalContent?: string;
  timing: number;
  counterPart: Ref;
}

export interface SendMessageJson extends MessageJson {
  uses?: Ref[];
}

export interface ReceiveMessageJson extends MessageJson {
  generates: (NewInformationJson)[];
  repeats?: (Ref)[];
  isInterrupted: boolean;
}


