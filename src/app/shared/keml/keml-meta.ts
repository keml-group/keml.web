// ===== Enums =====

import { ModelDefinition } from "emfular";

export enum InformationLinkType {
  SUPPLEMENT = 'SUPPLEMENT', //needs extra tests, jackson serialization treats it as 0 and hence does not write it
  SUPPORT = 'SUPPORT',
  STRONG_SUPPORT = 'STRONG_SUPPORT',
  ATTACK = 'ATTACK',
  STRONG_ATTACK = 'STRONG_ATTACK',
}

export const KemlMeta: ModelDefinition = {
  name: "keml",
  prefix: "keml",
  uri: "http://www.unikoblenz.de/keml",

  enums: {
    InformationLinkType
  },

  classes: {
    Conversation: {
      references: {
        author: {
          target: "Author",
          containment: true,
          min: 1,
          max: 1
        },
        conversationPartners: {
          target: "ConversationPartner",
          containment: true,
          min: 0,
          max: -1
        }
      }
    },

    ConversationPartner: {
      references: {}
    },

    LifeLine: {
      references: {}
    },

    Author: {
      references: {
        messages: {
          target: "Message",
          containment: true,
          min: 0,
          max: -1
        },
        preknowledge: {
          target: "PreKnowledge",
          containment: true,
          min: 0,
          max: -1
        }
      }
    },

    Message: {
      references: {
        counterPart: {
          target: "ConversationPartner",
          containment: false,
          min: 1,
          max: 1
        }
      }
    },

    SendMessage: {
      references: {
        uses: {
          target: "Information",
          containment: false,
          opposite: "isUsedOn",
          min: 0,
          max: -1
        }
      }
    },

    ReceiveMessage: {
      references: {
        generates: {
          target: "NewInformation",
          containment: true,
          opposite: "source",
          min: 0,
          max: -1
        },
        repeats: {
          target: "Information",
          containment: false,
          opposite: "repeatedBy",
          min: 0,
          max: -1
        }
      }
    },

    NewInformation: {
      references: {
        source: {
          target: "ReceiveMessage",
          containment: false,
          opposite: "generates",
          min: 1,
          max: 1
        }
      }
    },

    PreKnowledge: {
      references: {}
    },

    Information: {
      references: {
        repeatedBy: {
          target: "ReceiveMessage",
          containment: false,
          opposite: "repeats",
          min: 0,
          max: -1
        },
        targetedBy: {
          target: "InformationLink",
          containment: false,
          opposite: "target",
          min: 0,
          max: -1
        },
        causes: {
          target: "InformationLink",
          containment: true,
          opposite: "source",
          min: 0,
          max: -1
        },
        isUsedOn: {
          target: "SendMessage",
          containment: false,
          opposite: "uses",
          min: 0,
          max: -1
        }
      }
    },

    InformationLink: {
      references: {
        target: {
          target: "Information",
          containment: false,
          opposite: "targetedBy",
          min: 1,
          max: 1
        },
        source: {
          target: "Information",
          containment: false,
          opposite: "causes",
          min: 1,
          max: 1
        }
      }
    }
  }
} as const;
