import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

export interface SimulationInputs {
  weight?: number;
  preknowledgeDefault?: number;
  defaultsPerCp: Map<ConversationPartner, number|undefined>
}
