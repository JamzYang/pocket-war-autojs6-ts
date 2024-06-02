import {Quest, CollectCoinsQuest, FunctionConfig, GatherFoodQuest, SoloHuntQuest, GetInBusQuest} from "./types";
import {featureConfig} from  "./configLoader"
import {RuleConfig, Rule} from "./ruleEngine";
export interface Condition {
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  equals?: any;
  gtHoursAgo?: number;
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
        quest: new SoloHuntQuest()
      },
      {
        conditions: {
          idleTeams: { gt: 0 },
          gatherFood: {enable: featureConfig.gatherFood},
        },
        quest: new GatherFoodQuest()
      },
      {
        conditions: {
          idleTeams: { lte: 0 },
          collectCoins: {enable: featureConfig.collectCoins},
          lastCoinCollectionTime: { gtHoursAgo: 1 }
        },
        quest: new CollectCoinsQuest()
      },
      {
        conditions: {
          idleTeams: { gt: 0 },
          getInBus: {enable: featureConfig.getInBus.enabled},
        },
        quest: new GetInBusQuest()
      },
    ]
  };
}

