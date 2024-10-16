import { Injectable } from '@angular/core';
import {Author, Conversation, ConversationPartner, Message, ReceiveMessage} from "../models/sequence-diagram-models";
import {NewInformation, Preknowledge} from "../models/knowledge-models";
import {LayoutHelper} from "../layout-helper";

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
    // cannot, throws bc of circular ref this.repairSourceOfNewInfo(conv.author.messages);

    // now, the automatic conversion of the convP is included:
    LayoutHelper.positionConversationPartners(conv.conversationPartners);
    this.timeMessages(conv.author.messages);
    LayoutHelper.positionInfos(conv.author.preknowledge, conv.author.messages);
    console.log(conv);
    return conv;
  }

  newKEML(): Conversation {
    const author: Author = {
      name: 'Author',
      xPosition: 0,
      messages: [],
      preknowledge: [],
    }
    const convP = [{name: 'LLM', xPosition: 1, messages: []}];
    LayoutHelper.positionConversationPartners(convP);
    return {
      eClass: 'http://www.unikoblenz.de/keml#//Conversation',
      title: 'New Conversation',
      author: author,
      conversationPartners: convP
    }
  }

  resolveConversationPartnerReference(ref: string): number {
    // form is //@conversationPartners.<digits> - so we just remove a prefix
    let length = "//@conversationPartners.".length;
    return parseInt(ref.substring(length))
  }

  private timeMessages(messages: Message[]) {
    for (let i = 0; i < messages.length; i++) {
      messages[i].timing = i+1;
    }
  }

  addConversationPartner(cps: ConversationPartner[]) {
    const cp: ConversationPartner = {
      name: 'New Partner',
      xPosition: LayoutHelper.nextConversationPartnerPosition(cps[cps.length-1].xPosition), //todo
    }
    cps.push(cp);
  }

  // todo do not use, it causes circles
  repairSourceOfNewInfo(messages: Message[]) {
    for (let msg of messages) {
      //const infos = (msg as ReceiveMessage).generates;
      (msg as ReceiveMessage)?.generates?.forEach(r => {
        r.source = <ReceiveMessage>msg;
      })
    }
  }

}
