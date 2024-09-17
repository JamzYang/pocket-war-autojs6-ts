import {Condition } from "./condition";
import {ActionClassMap} from "../helper/ActionClassMap";
import {CharacterState} from "./characterState";
import {FunctionConfig} from "./functionConfig";
import {Quest} from "./quest";
import {SoloHuntQuest, RallyHuntQuest} from "../hunt";
import {CollectCoinsQuest} from "../collectCoins";
import {GatherFoodQuest} from "../gather";
import {GetInBusQuest} from "../getInBus";
import {OceanTreasureQuest} from "../oceanTreasure";
import {ExpeditionQuest} from "../expedition";

export interface Rule {
  conditions: { [key: string]: Condition };
  quest: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest;
}

export interface RuleConfig {
  rules: Rule[];
}

type RuleFunction = (characterState: CharacterState, functionConfig: FunctionConfig) => Quest | null;


function getNestedValue(obj: any, path: string): any {
  // return path.split('.').reduce((o, p) => o ? o[p] : undefined, obj);
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current[key] === undefined) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function evalQuest(QuestClass: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest, characterState: CharacterState, functionConfig: FunctionConfig): Quest {
  return new QuestClass(characterState, functionConfig);
}

function createRuleFunction(rule: Rule): RuleFunction {
  return (characterState, functionConfig) => {
    if( conditionAllMatched(rule, characterState, functionConfig)){
      let quest = evalQuest(rule.quest, characterState, functionConfig)
      if(quest.configMatched()){
        return quest
      }
    }
    return null;
  };
}



function conditionAllMatched(rule: Rule, characterState: CharacterState, functionConfig: FunctionConfig) {
  for (const [key, condition] of Object.entries(rule.conditions)) {
    const value = getNestedValue({...characterState, ...functionConfig}, key);
    if (value === undefined) return false;  // 如果属性不存在，条件不满足
    if (condition.gt !== undefined && !(value > condition.gt)) return false;
    if (condition.lt !== undefined && !(value < condition.lt)) return false;
    if (condition.gte !== undefined && !(value >= condition.gte)) return false;
    if (condition.lte !== undefined && !(value <= condition.lte)) return false;
    if (condition.equals !== undefined && value !== condition.equals) return false;
    if (condition.enable !== undefined && !condition.enable) return false;
  }
  return true;
}

function generateQuest(rules: RuleFunction[], characterState: CharacterState, functionConfig: FunctionConfig): Quest[] {
  let quests: Quest[] = [];
  for (const rule of rules) {
    const quest = rule(characterState, functionConfig);
    if (quest) {
      quests.push(quest)
    }
  }
  //根据 quest的权重排序
  quests.sort((a, b) => {
    if (a.weight === b.weight) {
      return 0;
    }
    return a.weight > b.weight ? -1 : 1;
  });
  return quests;
}

export function run(ruleConfig: RuleConfig, characterState: CharacterState, featureConfig: FunctionConfig): Quest[] {
  const ruleFunctions = ruleConfig.rules.map(createRuleFunction);
  return  generateQuest(ruleFunctions, characterState, featureConfig)
}