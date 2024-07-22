import {ConversationPartner} from "../sequence-diagram-models";

export interface Message {
  eClass: string;
  counterPart: ConversationPartner;
  timing: number;
  content: string;
  originalContent?: string;
}
