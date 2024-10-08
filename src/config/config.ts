import {CharacterState} from "../core/characterState";
import {Quest} from "../core/quest";
import {FunctionConfig} from "../core/functionConfig";
import {GatherType, HuntType} from "../enum";

export const characterState: CharacterState = {
  stamina: 100,
  totalTeams: 0,
  idleTeams: 1,
  lastQuests: new Map<string, Quest>(),
};

export const functionConfig: FunctionConfig = {
  freeDiamond: false,
  collectCoins: false,
  expedition: false,
  unionHelp:false,
  sandTableExercises: false,
  imperialTreasure: false,
  wildernessAction: false,
  islandOperations: false,
  clearShoppingCart: false,
  militaryBenefits: false,
  gather: {
    enabled: false,
    team1: { enabled: false, formationNum: 0, type:GatherType.Oil },
    team2: { enabled: false, formationNum: 0, type:GatherType.Food },
    team3: { enabled: false, formationNum: 0, type:GatherType.Oil },
    team4: { enabled: false, formationNum: 0, type:GatherType.Food },
    team5: { enabled: false, formationNum: 0, type:GatherType.Oil },
    team6: { enabled: false, formationNum: 0, type:GatherType.Oil },
    team7: { enabled: false, formationNum: 0, type:GatherType.Oil },
    team8: { enabled: false, formationNum: 0, type:GatherType.Oil },
  },

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