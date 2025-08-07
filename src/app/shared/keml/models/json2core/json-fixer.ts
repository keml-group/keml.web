import {Ref} from "emfular";
import {Author} from "@app/shared/keml/models/core/author";
import {Message, ReceiveMessage} from "@app/shared/keml/models/core/msg-info";
import {ConversationJson, ReceiveMessageJson,} from '@app/shared/keml/models/json/sequence-diagram-models'
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {EClasses} from "@app/shared/keml/models/eclasses";

export class JsonFixer {

  //since Supplement is =0 on the original KEML enum, it is not exported into the json
  static addMissingSupplementType(conv: ConversationJson) {
    conv.author.preknowledge?.forEach(pre => {
      pre.causes?.forEach(cause => {
        if (!cause.type) {
          cause.type = InformationLinkType.SUPPLEMENT
        }
      })
    })
    let receives = (conv.author.messages?.filter(r => !Message.isSend(r.eClass)) as ReceiveMessageJson[])
    receives?.forEach(rec => {
      rec.generates?.forEach(g => {
        g.causes?.forEach(cause => {
          if (!cause.type) {
            cause.type = InformationLinkType.SUPPLEMENT
          }
        })
      })
    })
  }

  /* idea:
  for each informationLink check the causes list and add the link itself as source to each entry
   */
  static prepareJsonInfoLinkSources(conv: ConversationJson) {
    let authorPrefix = Ref.computePrefix( Conversation.ownPath, Conversation.authorPrefix)
    conv.author.preknowledge?.map((p, index) => {
      let ref = new Ref(
        Ref.mixWithIndex(
          Ref.computePrefix(authorPrefix, Author.preknowledgePrefix),
          index
        ),
        EClasses.Preknowledge
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
            let ref = new Ref(infoPath, EClasses.NewInformation)
            newInfo.causes?.forEach(infoLink => infoLink.source = ref)
          })
        }
      }
    )
  }
}
