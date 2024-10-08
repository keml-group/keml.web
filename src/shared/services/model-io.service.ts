import { Injectable } from '@angular/core';
import {Author, Conversation, ConversationPartner, Message} from "../models/sequence-diagram-models";

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

    // now, the automatic conversion of the convP is included:
    this.positionConversationPartners(conv.conversationPartners);
    this.timeMessages(conv.author.messages);
    console.log(conv);
    return conv;
  }

  newKEML(): Conversation {
    const author: Author = {
      name: 'Author',
      messages: []
    }
    const convP = [{name: 'LLM'}];
    this.positionConversationPartners(convP);
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

  /*
   positions the xPositions of the convPartners list.
   It currently assumes no meaningful xPosition but just fills this field
   It could later evaluate the current values and adjust them if things are not ok
   */
  private positionConversationPartners(convPartners: ConversationPartner[]) {
    // distance to first partner should be bigger than distance in between:
    const distanceToFirst: number = 300;
    const distanceBetween: number = 150;
    for (let i = 0; i < convPartners.length; i++) {
      convPartners[i].xPosition = distanceToFirst + i*distanceBetween;
    }
  }

  private timeMessages(messages: Message[]) {
    for (let i = 0; i < messages.length; i++) {
      messages[i].timing = i+1;
    }
  }

  /*
  private positionMessages(messages: Message[]) {
    const distanceToFirst: number = 180;
    const distanceBetween: number = 60;

    for (let i = 0; i < messages.length; i++) {
      messages[i].timing = distanceToFirst + i*distanceBetween;
    }
  }*/

}
