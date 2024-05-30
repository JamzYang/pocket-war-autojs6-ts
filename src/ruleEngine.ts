import {CharacterState, FunctionConfig, Quest, Rule, NullQuest, ActionClassMap} from './types';
import { RuleConfig } from './configLoader';
import { characterState, functionConfig } from "./config/config";

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

export function createRuleFunction(ruleConfig: RuleConfig): Rule {
  return (characterState, functionConfig) => {
    let allMatched = conditionAllMatched(ruleConfig);

    if( allMatched ){
      return  evalQuest(ruleConfig.action)
    }
    return null;
  };
}



function conditionAllMatched(ruleConfig: RuleConfig) {
  let entries = Object.entries(ruleConfig.conditions);
  for (const [key, condition] of Object.entries(ruleConfig.conditions)) {
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

export function generateQuest(rules: Rule[]): Quest[] {
  let quests: Quest[] = [];
  for (const rule of rules) {
    const action = rule(characterState, functionConfig);
    if (action) {
      quests.push(action)
    }
  }
  return quests;
}
