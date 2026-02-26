import { ModelDefinition } from "emfular";

export enum InformationLinkType {
  SUPPLEMENT = 'SUPPLEMENT', //needs extra tests, jackson serialization treats it as 0 and hence does not write it
  SUPPORT = 'SUPPORT',
  STRONG_SUPPORT = 'STRONG_SUPPORT',
  ATTACK = 'ATTACK',
  STRONG_ATTACK = 'STRONG_ATTACK',
}

export const KemlMeta: ModelDefinition = {
  name: "KEML",
  prefix: "keml",
  uri: "",
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
          max: -1
        },
        preknowledge: {
          target: "PreKnowledge",
          containment: true,
          max: -1
        }
      }
    },

    SendMessage: {
      references: {
        uses: {
          target: "Information",
          opposite: "isUsedOn",
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
          max: -1
        },
        repeats: {
          target: "Information",
          opposite: "repeatedBy",
          max: -1
        }
      }
    },

    Message: {
      references: {
        counterPart: {
          target: "ConversationPartner",
          min: 1,
          max: 1
        }
      }
    },

    NewInformation: {
      references: {
        source: {
          target: "ReceiveMessage",
          isParent: true,
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
          opposite: "repeats",
          max: -1
        },
        targetedBy: {
          target: "InformationLink",
          opposite: "target",
          max: -1
        },
        causes: {
          target: "InformationLink",
          containment: true,
          opposite: "source",
          max: -1
        },
        isUsedOn: {
          target: "SendMessage",
          opposite: "uses",
          max: -1
        }
      }
    },

    InformationLink: {
      references: {
        target: {
          target: "Information",
          opposite: "targetedBy",
          min: 1,
          max: 1
        },
        source: {
          target: "Information",
          isParent: true,
          opposite: "causes",
          min: 1,
          max: 1
        }
      }
    }
  },
} as const;

export const ConversationRefs = {
  author: KemlMeta.classes["Conversation"].references["author"],
  conversationPartners: KemlMeta.classes["Conversation"].references["conversationPartners"],
};

export const ConversationPartnerRefs = {
  // no references
};

export const LifeLineRefs = {
  // no references
};

export const AuthorRefs = {
  messages: KemlMeta.classes["Author"].references["messages"],
  preknowledge: KemlMeta.classes["Author"].references["preknowledge"],
};

export const SendMessageRefs = {
  uses: KemlMeta.classes["SendMessage"].references["uses"],
};

export const ReceiveMessageRefs = {
  generates: KemlMeta.classes["ReceiveMessage"].references["generates"],
  repeats: KemlMeta.classes["ReceiveMessage"].references["repeats"],
};

export const MessageRefs = {
  counterPart: KemlMeta.classes["Message"].references["counterPart"],
};

export const NewInformationRefs = {
  source: KemlMeta.classes["NewInformation"].references["source"],
};

export const PreKnowledgeRefs = {
  // no references
};

export const InformationRefs = {
  repeatedBy: KemlMeta.classes["Information"].references["repeatedBy"],
  targetedBy: KemlMeta.classes["Information"].references["targetedBy"],
  causes: KemlMeta.classes["Information"].references["causes"],
  isUsedOn: KemlMeta.classes["Information"].references["isUsedOn"],
};

export const InformationLinkRefs = {
  target: KemlMeta.classes["InformationLink"].references["target"],
  source: KemlMeta.classes["InformationLink"].references["source"],
};
