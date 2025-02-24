import {Conversation} from "@app/shared/keml/models/core/conversation";
import {Author} from "@app/shared/keml/models/core/author";
import {
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/models/core/msg-info";
import {TrustComputator} from "@app/features/simulator/utils/trust-computator";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";

export class IncrementalSimulator {

  simulationInputs: SimulationInputs;
  completeConv: Conversation
  incrementalConv: Conversation

  constructor(simulationInputs: SimulationInputs, conv: Conversation) {
    this.simulationInputs = simulationInputs;
    this.completeConv = conv;
    let author = new Author(conv.author.name, conv.author.xPosition)
    this.incrementalConv = new Conversation(conv.title, author, conv.conversationPartners)
  }

  simulate() {
    for(let msg of this.completeConv.author.messages) {
      setInterval(() => {
        this.step(msg)
      },50)
    }
  }

  step(msg: Message): void {
    if(msg.isSend())
      this.stepSend((msg as SendMessage))
    else
      this.stepReceive((msg as ReceiveMessage))
    setInterval(
      () => {TrustComputator.computeCurrentTrusts(this.incrementalConv, this.simulationInputs)},
      20
    )
  }

  /*
  three steps:
    1) add send msg itself
    2) add "new" Preknowledges and all isUsedOn of the send
    3) add relationships of new preknowledges
   */
  stepSend(send: SendMessage) {
    let msg = new SendMessage(send.counterPart, send.timing, send.content, send.originalContent)
    this.incrementalConv.author.messages.push(msg)
    setInterval(()=> {
      this.incrementalConv.author.preknowledge.push(...this.findNewPreknowledges(send))
      msg.uses = send.uses // todo
    }, 50)
  }

  /*
  steps:
   1) add rec msg itself
   2) add generated new infos
   3) add relationships of those new infos
   */
  stepReceive(rec: ReceiveMessage) {
    let msg = new ReceiveMessage(rec.counterPart, rec.timing, rec.content, rec.originalContent)
    this.incrementalConv.author.messages.push(msg)
  }

  private findNewPreknowledges(send: SendMessage): Preknowledge[] {
    let pres: Preknowledge[] = send.uses.filter(use =>  ! (use as NewInformation).source)
      .map(u => (u as Preknowledge))
    return pres.filter(pre =>  pre.timeInfo() == send.timing)
  }

}
