import {Author} from "../author";
import {Message, NewInformation, Preknowledge, ReceiveMessage} from "../msg-info";
import {Ref} from "./ref";
import {Conversation as ConversationJson, ReceiveMessage as ReceiveMessageJson} from '../../sequence-diagram-models'
import {Conversation} from "../conversation";

export class JsonFixer {

  // we can decide whether preknowledge or new info just by looking at the prefix of ref (however, this is hacky)
  static determineParentInfoClass(ref: string): string {
    let pathSegments = ref.split(Ref.pathDivider)
    let relevant = pathSegments[pathSegments.length-2]
    console.log(ref)
    console.log(relevant)
    if (relevant.startsWith(Author.preknowledgePrefix))
      return Preknowledge.eClass
    else return NewInformation.eClass
  }

  /* idea:
  for each informationLink check the causes list and add the link itself as source to each entry
   */
  static prepareJsonInfoLinkSources(conv: ConversationJson) {
    console.log(conv)
    let authorPrefix = Ref.computePrefix( Conversation.ownPath, Conversation.authorPrefix)
    conv.author.preknowledge.map((p, index) => {
      let ref = new Ref(
        Ref.mixWithIndex(
          Ref.computePrefix(authorPrefix, Author.preknowledgePrefix),
          index
        ),
        Preknowledge.eClass
      )
      p.causes?.forEach(link =>
        link.source = ref
      )
    })

    conv.author.messages.map(
      (m, index) => {
        if (!Message.isSend(m.eClass)) {
          let msgPath = Ref.mixWithIndex(Ref.computePrefix(authorPrefix, Author.messagesPrefix), index)
          let rec = m as ReceiveMessageJson
          rec.generates?.map((newInfo, index2) => {
            let infoPath = Ref.mixWithIndex(
              Ref.computePrefix(msgPath, ReceiveMessage.generatesPrefix),
              index2)
            let ref = new Ref(infoPath, NewInformation.eClass)
            newInfo.causes?.forEach(infoLink => infoLink.source = ref)
          })

        }
      }
    )

    let receives = (conv.author.messages.filter(r => !Message.isSend(r.eClass)) as ReceiveMessageJson[])
    receives.map(receive =>
      receive.generates
    )
  }
}
