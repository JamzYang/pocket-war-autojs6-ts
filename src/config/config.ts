import {CharacterState} from "../core/characterState";
import {Quest} from "../core/quest";
import {FunctionConfig} from "../core/functionConfig";
import {HuntType} from "../enum";

export const characterState: CharacterState = {
  stamina: 100,
  totalTeams: 0,
  idleTeams: 1,
  lastQuests: new Map<string, Quest>(),
};

export const functionConfig: FunctionConfig = {
  collectCoins: false,
  gatherFood: false,
  soloHunt: {
    enabled: false,
    type: HuntType.byTurn,
    attackType:"五连",
    times: 1,
    level: 0,
    formationNum: 1
  },
  rallyHunt: {
    enabled: false,
    chuizi: {
      enabled: false,
      times: 1,
      level: 0,
      formationNum: 1
    },
    juxing: {
      enabled: false,
      times: 10,
      level: 0,
      formationNum: 1
    },
    right: {
      enabled: false,
      times: 10,
      level: 0,
      formationNum: 1
    },
    nanmin: {
      enabled: false,
      times: 10,
      formationNum: 1
    },
    heijun: {
      enabled: false,
      formationNum: 1
    },
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