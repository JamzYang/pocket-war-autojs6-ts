import {loadFeatureConfig} from "./configLoader"
import {RuleConfig} from "./ruleEngine";
import {SoloHuntQuest, RallyHuntQuest} from "../hunt";
import {CollectCoinsQuest} from "../collectCoins";
import {GatherQuest} from "../gather";
import {GetInBusQuest} from "../getInBus";
import {OceanTreasureQuest} from "../oceanTreasure";
import {ExpeditionQuest} from "../expedition";
import {FreeDiamondQuest} from "../FreeDiamondQuest";
import {FunctionConfig} from "./functionConfig";
import {UnionHelpQuest} from "../UnionHelp";
import {SandTableExercisesQuest} from "../SandTableExercisesQuest";
import {ImperialTreasureQuest} from "../ImperialTreasureQuest";
import {ClearShoppingCartQuest} from "../ClearShoppingCartQuest";
import {MilitaryBenefitsQuest} from "../MilitaryBenefitsQuest";
import {IslandOperationsQuest} from "../IslandOperationsQuest";
import {WildernessActionQuest} from "../WildernessActionQuest";

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

        //todo 选建两个
      {
        name: "Team1GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team1": { enable: functionConfig.gather.team1.enabled },
        },
        quest: GatherQuest
      },
      {
        name: "Team2GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team2": { enable: functionConfig.gather.team2.enabled },
        },
        quest: GatherQuest
      },
      {
        name: "Team3GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team3": { enable: functionConfig.gather.team3.enabled },
        },
        quest: GatherQuest
      },
      {
        name: "Team4GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team4": { enable: functionConfig.gather.team4.enabled },
        },
        quest: GatherQuest
      },
      {
        name: "Team5GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team5": { enable: functionConfig.gather.team5.enabled },
        },
        quest: GatherQuest
      },
      {
        name: "Team6GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team6": { enable: functionConfig.gather.team6.enabled },
        },
        quest: GatherQuest
      },

      {
        name: "Team7GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team7": { enable: functionConfig.gather.team7.enabled },
        },
        quest: GatherQuest
      },
      {
        name: "Team8GatherQuest Rule",
        conditions: {
          idleTeams: { gt: 0 },
          gather: {enable: functionConfig.gather.enabled},
          "gather.team8": { enable: functionConfig.gather.team8.enabled },
        },
        quest: GatherQuest
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
        name: "Union help Rule",
        conditions: {
          collectCoins: {enable: functionConfig.unionHelp},
        },
        quest: UnionHelpQuest
      },
      {
        name: "SandTableExercises Rule",
        conditions: {
          collectCoins: {enable: functionConfig.sandTableExercises},
        },
        quest: SandTableExercisesQuest
      },
      {
        name: "imperialTreasure Rule",
        conditions: {
          collectCoins: {enable: functionConfig.imperialTreasure},
        },
        quest: ImperialTreasureQuest
      },
      {
        name: "wildernessAction Rule",
        conditions: {
          collectCoins: {enable: functionConfig.wildernessAction},
        },
        quest: WildernessActionQuest
      },
      {
        name: "islandOperations Rule",
        conditions: {
          collectCoins: {enable: functionConfig.islandOperations},
        },
        quest: IslandOperationsQuest
      },
      {
        name: "clearShoppingCart Rule",
        conditions: {
          collectCoins: {enable: functionConfig.clearShoppingCart},
        },
        quest: ClearShoppingCartQuest
      },
      {
        name: "militaryBenefits Rule",
        conditions: {
          collectCoins: {enable: functionConfig.militaryBenefits},
        },
        quest: MilitaryBenefitsQuest
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

