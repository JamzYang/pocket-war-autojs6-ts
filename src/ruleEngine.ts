import {CharacterState, FunctionConfig, Quest, NullQuest, ActionClassMap} from './types';
import { characterState, functionConfig } from "./config/config";
import {Condition, loadRuleConfig } from "./condition";


export interface Rule {
  conditions: { [key: string]: Condition };
  action: string;
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

function evalQuest(actionName: string): Quest {
  let questClass = ActionClassMap[actionName];
  if(!questClass) {
    throw new Error(`Unknown action name: ${actionName}`);
  }
  return new questClass(characterState, functionConfig);
}

function createRuleFunction(rule: Rule): RuleFunction {
  return (characterState, functionConfig) => {
    if( conditionAllMatched(rule) ){
      return  evalQuest(rule.action)
    }
    return null;
  };
}



function conditionAllMatched(rule: Rule) {
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
    if (condition.enable !== undefined && true !== condition.enable) return false;
    if (condition.gtHoursAgo !== undefined
        && !(new Date().getTime() - value.getTime() > condition.gtHoursAgo * 60 * 60 * 1000))
      return false;
  }
  return true;
}

function generateQuest(rules: RuleFunction[]): Quest[] {
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

export function run(): Quest[] {
  let ruleConfig = loadRuleConfig()
  const ruleFunctions = ruleConfig.rules.map(createRuleFunction);
  return  generateQuest(ruleFunctions)
}