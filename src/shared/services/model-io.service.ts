import { Injectable } from '@angular/core';
import {Conversation, ConversationPartner, Message} from "../models/sequence-diagram-models";

@Injectable({
  providedIn: 'root'
})
export class ModelIOService {

  constructor() { }

  loadKEML(json: string): Conversation {
    let conv =  <Conversation>JSON.parse(json);

    //resolve conv Partner refs
    let convPartners = conv.conversationPartners;
    conv.author.messages?.forEach(message => {
      let ref = message.counterPart.$ref; //todo is correct because references are not correctly parsed now
      message.counterPart = convPartners[this.resolveConversationPartnerReference(ref? ref : "")];
    })
    // todo resolve others
    return conv;
  }

  initializeKEML(): Conversation {
    return {
      eClass: 'http://www.unikoblenz.de/keml#//Conversation',
      title: 'New Conversation',
      author: {
        name: 'Author',
        messages: []
      },
      conversationPartners: [
        {name: 'LLM'}
      ]
    };
  }

  resolveConversationPartnerReference(ref: string): number {
    // form is //@conversationPartners.<digits> - so we just remove a prefix
    let length = "//@conversationPartners.".length;
    return parseInt(ref.substring(length))
  }


}
