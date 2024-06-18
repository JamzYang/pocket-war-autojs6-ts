import {HuntType} from "../enum";

export interface FunctionConfig {
  collectCoins: boolean;
  expedition: boolean;
  gatherFood: boolean;
  soloHunt: {
    enabled: boolean,
    type: HuntType,
    attackType: string, //5连, 单次
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