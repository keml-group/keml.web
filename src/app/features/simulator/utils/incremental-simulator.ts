import {Conversation} from "@app/shared/keml/models/core/conversation";
import {Author} from "@app/shared/keml/models/core/author";
import {
  Information, InformationLink,
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

  msgConnections: Map<string, Message> = new Map<string, Message>();
  infoConnections: Map<string, Information> = new Map<string, Information>();

  constructor(simulationInputs: SimulationInputs, conv: Conversation) {
    this.simulationInputs = simulationInputs;
    this.completeConv = conv;
    let author = new Author(conv.author.name, conv.author.xPosition)
    this.incrementalConv = new Conversation(conv.title, author, conv.conversationPartners)
  }

  async simulate() {
    for (let msg of this.completeConv.author.messages) {
      await this.step(msg)
    }
  }

  async step(msg: Message) {
    if(msg.isSend())
      await this.stepSend((msg as SendMessage))
    else
      await this.stepReceive((msg as ReceiveMessage))
  }

  /*
  three steps:
    1) add send msg itself
    2) add "new" Preknowledges and all isUsedOn of the send
    3) add relationships of new preknowledges
   */
  async stepSend(send: SendMessage) {
    let msg = new SendMessage(send.counterPart, send.timing, send.content, send.originalContent)
    this.msgConnections.set(send.gId, msg)
    this.incrementalConv.author.messages.push(msg)
    await this.sleep(500)
    let pres = this.findNewPreknowledges(send)
    this.incrementalConv.author.preknowledge.push(...pres.map(p => this.copyPreknowledge(p)))
    msg.uses = send.uses.map(u => this.infoConnections.get(u.gId)!)
    await this.linkStep(pres)
 }

  /*
  steps:
   1) add rec msg itself
   2) add generated new infos
   3) add relationships of those new infos
   */
  async stepReceive(rec: ReceiveMessage) {
    let msg = new ReceiveMessage(rec.counterPart, rec.timing, rec.content, rec.originalContent)
    this.incrementalConv.author.messages.push(msg)
    await this.sleep(500)
    let newInfos = rec.generates.map(i => this.copyNewInfo(i))
    msg.generates.push(...newInfos)
    await this.linkStep(newInfos)
  }

  private findNewPreknowledges(send: SendMessage): Preknowledge[] {
    let pres: Preknowledge[] = send.uses.filter(use =>  ! (use as NewInformation).source)
      .map(u => (u as Preknowledge))
    return pres.filter(pre =>  pre.timeInfo() == send.timing)
  }

  private copyPreknowledge(pre: Preknowledge): Preknowledge {
    let preNew = new Preknowledge(
      pre.message,
      pre.isInstruction,
      pre.position,
      pre.causes,
      [],
      [],
      [],
      pre.initialTrust,
      undefined,
      pre.feltTrustImmediately,
      pre.feltTrustAfterwards
    )
    this.infoConnections.set(pre.gId, preNew)
    return preNew
  }

  private copyNewInfo(newInfo: NewInformation): NewInformation {
    let newNew = new NewInformation(
      newInfo.source, //todo copied src
      newInfo.message,
      newInfo.isInstruction,
      newInfo.position,
      newInfo.causes,
      [],
      [],
      [],
      newInfo.initialTrust,
      undefined,
      newInfo.feltTrustImmediately,
      newInfo.feltTrustAfterwards
    )
    this.infoConnections.set(newInfo.gId, newNew)
    return newNew
  }

  private addLinks(info: Information) {
    info.causes.map(link => {
      new InformationLink(info, this.infoConnections.get(link.target.gId)!, link.type, link.linkText)
    })
  }

  private async linkStep(infos: Information[]) {
    TrustComputator.computeCurrentTrusts(this.incrementalConv, this.simulationInputs)
    await this.sleep(500)
    // set links:
    infos.map(info => this.addLinks(info))
    await this.sleep(100)
    TrustComputator.computeCurrentTrusts(this.incrementalConv, this.simulationInputs)
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
