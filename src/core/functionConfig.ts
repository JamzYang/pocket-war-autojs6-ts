import {GatherType, HuntType} from "../enum";

export interface FunctionConfig {
  freeDiamond: boolean;
  collectCoins: boolean;
  expedition: boolean;
  unionHelp: boolean,
  sandTableExercises: boolean,
  imperialTreasure: boolean,
  wildernessAction: boolean,
  islandOperations: boolean,
  clearShoppingCart: boolean,
  militaryBenefits: boolean,
  gather: {
    enabled: boolean,
    team1: { enabled: boolean, formationNum: number, type: GatherType },
    team2: { enabled: boolean, formationNum: number, type: GatherType },
    team3: { enabled: boolean, formationNum: number, type: GatherType },
    team4: { enabled: boolean, formationNum: number, type: GatherType },
    team5: { enabled: boolean, formationNum: number, type: GatherType },
    team6: { enabled: boolean, formationNum: number, type: GatherType },
    team7: { enabled: boolean, formationNum: number, type: GatherType },
    team8: { enabled: boolean, formationNum: number, type: GatherType },
  },

  soloHunt: {
    enabled: boolean,
    type: HuntType,
    attackType: string, //["五连", "单杀"];
    level: number,
    times: number,
    formationNum: number
  },
  rallyHunt: {
    enabled: boolean;
    chuizi: {
      enabled: boolean,
      times: number,
      level: number,
      formationNum: number
    },
    juxing: {
      enabled: boolean,
      times: number,
      level: number,
      formationNum: number
    },
    right: {
      enabled: boolean,
      times: number,
      level: number,
      formationNum: number
    },
    nanmin: {
      enabled: boolean,
      times: number,
      formationNum: number
    },
    heijun: {
      enabled: boolean,
      formationNum: number
    },
  },
  getInBus: {
    enabled: boolean,
    chuizi: {
      enabled: boolean,
      times: number,
    },
    nanmin: {
      enabled: boolean,
      times: number,
    },
    heijun: {
      enabled: boolean,
      times: number,
    },
    juxing: {
      enabled: boolean,
      times: number,
    },
    formationNum: number
  },

  events: {
    oceanTreasure: {
      enabled: boolean,
      detectorNum: number
    },
  }
}