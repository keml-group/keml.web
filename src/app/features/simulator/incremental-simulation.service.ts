import {Conversation} from "@app/shared/keml/core/conversation";
import {Author} from "@app/shared/keml/core/author";
import {
  Information, InformationLink,
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/core/msg-info";
import {TrustComputationService} from "@app/features/simulator/trust-computation/trust-computation.service";
import {TrustFallbacks} from "@app/features/simulator/trust-computation/trust-fallbacks";
import {Injectable, signal, WritableSignal} from "@angular/core";

@Injectable()
export class IncrementalSimulationService {

  msgCount: WritableSignal<number> = signal(0)

  simulationInputs: TrustFallbacks = new TrustFallbacks();
  completeConv: Conversation = new Conversation();
  incrementalConv: Conversation = this.completeConv
  //todo maybe export current msgCount here? this way, the line could be adapted on incremental conv


  msgConnections: Map<string, Message> = new Map<string, Message>();
  infoConnections: Map<string, Information> = new Map<string, Information>();

  pauseRequested: boolean = false;

  constructor(
    private trustComputationService: TrustComputationService,
  ) {}

  private prepare(simulationInputs: TrustFallbacks, conv: Conversation) {
    this.simulationInputs = simulationInputs;
    this.completeConv = conv;
    let author = new Author(conv.author.name, conv.author.xPosition)
    this.incrementalConv = new Conversation(conv.title, author)
    this.incrementalConv.addCP(...conv.conversationPartners) //todo duplicate cps?
    this.msgConnections = new Map<string, Message>();
    this.infoConnections = new Map<string, Information>();
  }

  async simulate(simulationInputs: TrustFallbacks, conv: Conversation) {
    this.prepare(simulationInputs, conv);
    for (let msg of this.completeConv!.author.messages) {
      await this.step(msg)
    }
  }

  private async step(msg: Message) {
    if(msg.isSend())
      await this.stepSend((msg as SendMessage))
    else
      await this.stepReceive((msg as ReceiveMessage))
  }

  /*
  three steps:
    1) add send msg itself
    2) add "new" Preknowledges and all isUsedOn of the send
    3) add relationships of new preknowledges (linkStep)
   */
  private async stepSend(send: SendMessage) {
    let msg = new SendMessage(send.counterPart, send.timing, send.content, send.originalContent)
    this.msgConnections.set(send.gId, msg)
    this.incrementalConv.author.messages.push(msg)
    this.msgCount.update(n => n+1)
    await this.sleep(500)
    let pres = this.findNewPreknowledges(send)
    this.incrementalConv.author.preknowledge.push(...pres.map(p => this.copyPreknowledge(p)))
    let uses = send.uses.map(u => this.infoConnections.get(u.gId)!)
    uses.map(u => u.addIsUsedOn(msg))
    await this.linkStep(pres)
 }

  /*
  steps:
   1) add rec msg itself
   2) add generated new infos and repetitions of the current rec
   3) add relationships of those new infos (linkStep)
   */
  private async stepReceive(rec: ReceiveMessage) {
    let msg = new ReceiveMessage(rec.counterPart, rec.timing, rec.content, rec.originalContent)
    this.msgConnections.set(rec.gId, msg)
    this.incrementalConv.author.messages.push(msg)
    this.msgCount.update(n => n+1)
    await this.sleep(500)
    let repeats: Information[] = rec.repeats.map(i => this.infoConnections.get(i.gId)!)
    msg.repeats.push(...repeats)
    repeats.forEach(r => r.repeatedBy.push(msg))
    let newInfos = rec.generates
    msg.generates.push(...newInfos.map(i => this.copyNewInfo(i)))
    await this.linkStep(newInfos)
  }

  private findNewPreknowledges(send: SendMessage): Preknowledge[] {
    let pres: Preknowledge[] = send.uses.filter(use =>  ! (use as NewInformation).source)
      .map(u => (u as Preknowledge))
    return pres.filter(pre =>  pre.getTiming() == send.timing)
  }

  private copyPreknowledge(pre: Preknowledge): Preknowledge {
    let preNew = new Preknowledge(
      pre.message,
      pre.isInstruction,
      pre.position,
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
      (this.msgConnections.get(newInfo.source.gId) as ReceiveMessage)!,
      newInfo.message,
      newInfo.isInstruction,
      newInfo.position,
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
      let src = this.infoConnections.get(info.gId)
      let tar = this.infoConnections.get(link.target.gId)
      new InformationLink(src!, tar!, link.type, link.linkText)
    })
  }

  private async linkStep(infos: Information[]) {
    this.trustComputationService.computeCurrentTrusts(this.incrementalConv, this.simulationInputs)
    await this.sleep(500)
    // set links:
    infos.map(info => this.addLinks(info))
    await this.sleep(100)
    this.trustComputationService.computeCurrentTrusts(this.incrementalConv, this.simulationInputs)
  }

  private async sleep(ms: number) {
    await this.waitIfPaused()
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async waitIfPaused(): Promise<void> {
    while (this.pauseRequested) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100ms
    }
  }

  pauseAndResume(): void {
    this.pauseRequested = !this.pauseRequested;
  }
}
