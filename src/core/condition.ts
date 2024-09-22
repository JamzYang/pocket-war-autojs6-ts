import {loadFeatureConfig} from "./configLoader"
import {RuleConfig} from "./ruleEngine";
import {SoloHuntQuest, RallyHuntQuest} from "../hunt";
import {CollectCoinsQuest} from "../collectCoins";
import {GatherFoodQuest} from "../gather";
import {GetInBusQuest} from "../getInBus";
import {OceanTreasureQuest} from "../oceanTreasure";
import {ExpeditionQuest} from "../expedition";
import {FreeDiamondQuest} from "../FreeDiamondQuest";
import {FunctionConfig} from "./functionConfig";

export interface Condition {
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  equals?: any;
  enable?: boolean;
}

export function loadRuleConfig(functionConfig: FunctionConfig): RuleConfig {
  return {
    rules: [
      {
        name: "Solo Hunt Rule",
        conditions: {
          stamina: { gt: 30 },
          idleTeams: { gt: 0 },
          soloHunt: {enable: functionConfig.soloHunt.enabled},
          "soloHunt.times": { gt: 0 }
        },
        quest: SoloHuntQuest
      },
      {
        name: "Rally Hunt chuizi Rule",
        conditions: {
          stamina: { gt: 30 },
          idleTeams: { gt: 0 },
          rallyHunt: {enable: functionConfig.rallyHunt.enabled},
          "rallyHunt.chuizi": {enable: functionConfig.rallyHunt.chuizi.enabled},
          "rallyHunt.chuizi.times": {gt: 0},
        },
        quest: RallyHuntQuest
      },
      {
        name: "Rally Hunt juxing Rule",
        conditions: {
          stamina: { gt: 30 },
          idleTeams: { gt: 0 },
          rallyHunt: {enable: functionConfig.rallyHunt.enabled},
          "rallyHunt.juxing": {enable: functionConfig.rallyHunt.juxing.enabled},
          "rallyHunt.juxing.times": {gt: 0},
        },
        quest: RallyHuntQuest
      },
      {
        name: "Rally Hunt nanmin Rule",
        conditions: {
          stamina: { gt: 30 },
          idleTeams: { gt: 0 },
          rallyHunt: {enable: functionConfig.rallyHunt.enabled},
          "rallyHunt.nanmin": {enable: functionConfig.rallyHunt.nanmin.enabled},
          "rallyHunt.nanmin.times": {gt: 0},
        },
        quest: RallyHuntQuest
      },

      {
        name: "Gather Food Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gatherFood: {enable: functionConfig.gatherFood},
        },
        quest: GatherFoodQuest
      },
      {
        name: "Free Diamond Rule",
        conditions: {
          freeDiamond: {enable: functionConfig.freeDiamond},
        },
        quest: FreeDiamondQuest
      },
      {
        name: "Collect Coins Rule",
        conditions: {
          idleTeams: { lte: 0 },
          collectCoins: {enable: functionConfig.collectCoins},
        },
        quest: CollectCoinsQuest
      },
      {
        name: "Expedition Rule",
        conditions: {
          collectCoins: {enable: functionConfig.expedition},
        },
        quest: ExpeditionQuest
      },
      {
        name: "Get In Bus Rule",
        conditions: {
          idleTeams: { gt: 0 },
          getInBus: {enable: functionConfig.getInBus.enabled},
        },
        quest: GetInBusQuest
      },
      {
        name: "Ocean Treasure Rule",
        conditions: {
          "events.oceanTreasure": {enable: functionConfig.events.oceanTreasure.enabled},
        },
        quest: OceanTreasureQuest
      },
    ]
  };
}

