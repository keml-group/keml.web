import {Preknowledge} from "./msg-info";
import {PreknowledgeJson} from "./json/knowledge-models";

describe('Msg-Info (models)', () => {
  it('should serialize preknowledge', () => {
    let preknowledge = new Preknowledge()
    let preknowledgeJson : PreknowledgeJson = {
      causes: [],
      currentTrust: 0.5,
      eClass: Preknowledge.eClass,
      position: {x: 0, y: 0, w: 5, h: 5},
      feltTrustAfterwards: undefined,
      feltTrustImmediately: undefined,
      initialTrust: 0.5,
      isInstruction: false,
      isUsedOn: [],
      message: "Preknowledge",
      repeatedBy: [],
      targetedBy: []
    }
    expect(preknowledge.toJson()).toEqual(preknowledgeJson);
  });
});
