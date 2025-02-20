import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";

export interface SimulationInputs {
  weight?: number;
  preknowledgeDefault?: number;
  defaultsPerCp: Map<ConversationPartner, number|undefined>
}
