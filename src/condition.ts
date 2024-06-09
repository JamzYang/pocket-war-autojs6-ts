import {Quest, CollectCoinsQuest, FunctionConfig, GatherFoodQuest, SoloHuntQuest, GetInBusQuest} from "./types";
import {loadFeatureConfig} from  "./configLoader"
import {RuleConfig, Rule} from "./ruleEngine";
export interface Condition {
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  equals?: any;
  enable?: boolean;
}


export function loadRuleConfig(): RuleConfig {
  return {
    rules: [
      {
        conditions: {
          stamina: { gt: 50 },
          idleTeams: { gt: 0 },
        },
        quest: "SoloHuntQuest"
      },
      {
        conditions: {
          idleTeams: { gt: 0 },
          gatherFood: {enable: loadFeatureConfig().gatherFood},
        },
        quest: "GatherFoodQuest"
      },
      {
        conditions: {
          idleTeams: { lte: 0 },
          collectCoins: {enable: loadFeatureConfig().collectCoins},
        },
        quest: "CollectCoinsQuest"
      },
      {
        conditions: {
          idleTeams: { gt: 0 },
          getInBus: {enable: loadFeatureConfig().getInBus.enabled},
        },
        quest: "GetInBusQuest"
      },
      {
        conditions: {
          idleTeams: { gt: -1 },
          oceanTreasure: {enable: loadFeatureConfig().events.oceanTreasure.enabled},
        },
        quest: "OceanTreasureQuest"
      },
    ]
  };
}

