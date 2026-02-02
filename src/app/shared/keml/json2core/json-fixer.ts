import {Author} from "@app/shared/keml/core/author";
import {Message, ReceiveMessage} from "@app/shared/keml/core/msg-info";
import {ConversationJson, ReceiveMessageJson,} from '@app/shared/keml/json/sequence-diagram-models'
import {Conversation} from "@app/shared/keml/core/conversation";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler} from "emfular";

export class JsonFixer {

  /* idea:
  for each informationLink check the causes list and add the link itself as source to each entry
   */
  static prepareJsonInfoLinkSources(conv: ConversationJson) {
    let authorPrefix = RefHandler.computePrefix( RefHandler.rootPath, Conversation.$authorName)
    conv.author?.preknowledge?.map((p, index) => {
      let ref = RefHandler.createRef(
        RefHandler.mixWithIndex(
          RefHandler.computePrefix(authorPrefix, Author.$preknowledgeName),
          index
        ),
        EClasses.Preknowledge
      )
      p.causes?.forEach(link =>
        link.source = ref
      )
    })

    conv.author?.messages?.map(
      (m, index) => {
        if (!Message.isSend(m.eClass)) {
          let msgPath = RefHandler.mixWithIndex(RefHandler.computePrefix(authorPrefix, Author.$messagesName), index)
          let rec = m as ReceiveMessageJson
          rec.generates?.map((newInfo, index2) => {
            let infoPath = RefHandler.mixWithIndex(
              RefHandler.computePrefix(msgPath, ReceiveMessage.$generatesName),
              index2)
            let ref = RefHandler.createRef(infoPath, EClasses.NewInformation)
            newInfo.causes?.forEach(infoLink => infoLink.source = ref)
          })
        }
      }
    )
  }
}
