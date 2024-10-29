import {Information} from "./information";
import {ReceiveMessage} from "./receive-message";
import {InformationLink} from "./information-link";
import {SendMessage} from "./send-message";

export class NewInformation extends Information {
  source: ReceiveMessage;

  constructor(source: ReceiveMessage,
              message: string, isInstruction: boolean = false,  x: number = 0, y: number = 0,
              initialTrust: number = 0.5, currentTrust: number = 0.5,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],) {
    super(message, isInstruction, x, y,
      initialTrust, currentTrust,
      causes, targetedBy,
      isUsedOn, repeatedBy,);
    this.source = source;
  }
}
