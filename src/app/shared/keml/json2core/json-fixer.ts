import {Author} from "@app/shared/keml/core/author";
import {Message, ReceiveMessage} from "@app/shared/keml/core/msg-info";
import {ConversationJson, ReceiveMessageJson,} from '@app/shared/keml/json/sequence-diagram-models'
import {Conversation} from "@app/shared/keml/core/conversation";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler} from "emfular";

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
    let authorPrefix = RefHandler.computePrefix( RefHandler.rootPath, Conversation.authorPrefix)
    conv.author.preknowledge?.map((p, index) => {
      let ref = RefHandler.createRef(
        RefHandler.mixWithIndex(
          RefHandler.computePrefix(authorPrefix, Author.preknowledgePrefix),
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
          let msgPath = RefHandler.mixWithIndex(RefHandler.computePrefix(authorPrefix, Author.messagesPrefix), index)
          let rec = m as ReceiveMessageJson
          rec.generates?.map((newInfo, index2) => {
            let infoPath = RefHandler.mixWithIndex(
              RefHandler.computePrefix(msgPath, ReceiveMessage.generatesPrefix),
              index2)
            let ref = RefHandler.createRef(infoPath, EClasses.NewInformation)
            newInfo.causes?.forEach(infoLink => infoLink.source = ref)
          })
        }
      }
    )
  }
}
