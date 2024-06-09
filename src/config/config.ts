import {CharacterState, FunctionConfig, HuntType, Quest} from "../types";

export const characterState: CharacterState = {
  stamina: 0,
  totalTeams: 0,
  idleTeams: 1,
  lastQuests: new Map<string, Quest>(),
};

export const functionConfig: FunctionConfig = {
  collectCoins: false,
  gatherFood: false,
  soloHunt: {
    enabled: false,
    type: HuntType.Normal,
    level: 1,
    formationNum: 1
  },
  rallyHunt: {
    enabled: false,
    type: HuntType.Normal,
    level: 1,
    formationNum: 1
  },
  getInBus: {
    enabled: true,
    chuizi: {
      enabled: false,
      times: 0,
    },
    nanmin: {
      enabled: false,
      times: 0,
    },
    heijun: {
      enabled: false,
      times: 0,
    },
    juxing: {
      enabled: false,
      times: 0,
    },
    formationNum: 1
  },
  events: {
    oceanTreasure: {
      enabled: false,
      detectorNum: 1
    },
  }
};