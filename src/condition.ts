import {Quest, CollectCoinsQuest, FunctionConfig, GatherFoodQuest, SoloHuntQuest} from "./types";
import {featureConfig} from  "./configLoader"
interface Condition {
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  equals?: any;
  gtHoursAgo?: number;
  enable?: boolean;
}

interface Rule {
  conditions: { [key: string]: Condition };
  action: string;
}

interface RuleConfig {
  rules: Rule[];
}

export const ruleConfig: RuleConfig = {
  rules: [
    {
      conditions: {
        stamina: { gt: 50 },
        idleTeams: { gt: 0 },
      },
      action: SoloHuntQuest.name
    },
    {
      conditions: {
        idleTeams: { gt: 0 },
        gatherFood: {enable: featureConfig.gatherFood},
      },
      action: GatherFoodQuest.name
    },
    {
      conditions: {
        idleTeams: { lte: 0 },
        collectCoins: {enable: featureConfig.collectCoins},
        lastCoinCollectionTime: { gtHoursAgo: 1 }
      },
      action: CollectCoinsQuest.name
    }
  ]
};

