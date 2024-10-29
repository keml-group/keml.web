import {ReceiveMessage} from "./receive-message";
import {SendMessage} from "./send-message";
import {InformationLink} from "./information-link";

export abstract class Information {

  eClass = '';
  message: string;
  isInstruction: boolean;
  x: number = 0;
  y: number = 0;
  initialTrust: number;
  currentTrust: number;

  causes: InformationLink[]; //todo avoid?
  targetedBy: InformationLink[]; //todo avoid?

  isUsedOn: SendMessage[];
  repeatedBy: ReceiveMessage[];


  protected constructor(message: string, isInstruction: boolean = false,  x: number = 0, y: number = 0,
                        initialTrust: number = 0.5, currentTrust: number = 0.5,
                        causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
                        isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],) {
    this.message = message;
    this.isInstruction = isInstruction;
    this.x = x;
    this.y = y;
    this.initialTrust = initialTrust;
    this.currentTrust = currentTrust;
    this.causes = causes;
    this.targetedBy = targetedBy;
    this.isUsedOn = isUsedOn;
    this.repeatedBy = repeatedBy;
  }
}
