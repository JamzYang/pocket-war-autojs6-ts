import {Condition } from "./condition";
import {ActionClassMap} from "../helper/ActionClassMap";
import {CharacterState} from "./characterState";
import {FunctionConfig} from "./functionConfig";
import {Quest} from "./quest";


export interface Rule {
  conditions: { [key: string]: Condition };
  quest: string;
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

function evalQuest(actionName: string, characterState: CharacterState, functionConfig: FunctionConfig): Quest {
  let questClass = ActionClassMap[actionName];
  if(!questClass) {
    throw new Error(`Unknown action name: ${actionName}`);
  }
  return new questClass(characterState, functionConfig);
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
    //没定义 默认为true
    //定义了， 且条件成立 继续
    //condition中已定义的条件都成立，则返回true。 未定义的条件默认为成立
    const value = getNestedValue({...characterState, ...functionConfig}, key);
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