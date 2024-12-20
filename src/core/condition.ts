import {loadFeatureConfig} from "./configLoader"
import {RuleConfig} from "./ruleEngine";
import {ExpeditionQuest} from "../expedition";
export interface Condition {
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  equals?: any;
  enable?: boolean;
}


export function loadRuleConfig(): RuleConfig {
  const functionConfig = loadFeatureConfig();
  return {
    rules: [
      {
        conditions: {
          stamina: { gt: 30 },
          idleTeams: { gt: 0 },
          soloHunt: {enable: functionConfig.soloHunt.enabled},
        },
        quest: "SoloHuntQuest"
      },
      {
        conditions: {
          stamina: { gt: 30 },
          idleTeams: { gt: 0 },
          rallyHunt: {enable: functionConfig.rallyHunt.enabled},
        },
        quest: "RallyHuntQuest"
      },
      {
        conditions: {
          idleTeams: { gt: 0 },
          gatherFood: {enable: functionConfig.gatherFood},
        },
        quest: "GatherFoodQuest"
      },
      {
        conditions: {
          idleTeams: { lte: 0 },
          collectCoins: {enable: functionConfig.collectCoins},
        },
        quest: "CollectCoinsQuest"
      },
      {
        conditions: {
          collectCoins: {enable: functionConfig.expedition},
        },
        quest: "ExpeditionQuest"
      },
      {
        conditions: {
          idleTeams: { gt: 0 },
          getInBus: {enable: functionConfig.getInBus.enabled},
        },
        quest: "GetInBusQuest"
      },
      {
        conditions: {
          idleTeams: { gt: -1 },
          oceanTreasure: {enable: functionConfig.events.oceanTreasure.enabled},
        },
        quest: "OceanTreasureQuest"
      },
    ]
  };
}

