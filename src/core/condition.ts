import {loadFeatureConfig} from "./configLoader"
import {RuleConfig} from "./ruleEngine";
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
        },
        quest: "SoloHuntQuest"
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

