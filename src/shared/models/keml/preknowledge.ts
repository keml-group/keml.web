import {Information} from "./information";
import {InformationLink} from "./information-link"
import {ReceiveMessage} from "./receive-message"
import {SendMessage} from "./send-message"
import {Preknowledge as PreknowledgeJson} from "../knowledge-models"

export class Preknowledge extends Information {

  constructor(message: string, isInstruction: boolean = false,  x: number = 0, y: number = 0,
              initialTrust: number = 0.5, currentTrust: number = 0.5,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],) {
    super(message, isInstruction, x, y,
      initialTrust, currentTrust,
      causes, targetedBy,
      isUsedOn, repeatedBy,);
  }

  static fromJSON(pre: PreknowledgeJson): Preknowledge {
    return new Preknowledge(pre.message, pre.isInstruction);
  }
}
