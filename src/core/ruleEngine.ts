import {Condition} from "./condition";
import {CharacterState} from "./characterState";
import {FunctionConfig} from "./functionConfig";
import {Quest} from "./quest";

export interface Rule {
  name: string; // 添加名称字段
  conditions: { [key: string]: Condition };
  quest: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest;
}

export interface RuleConfig {
  rules: Rule[];
}

type RuleFunction = {
  name: string;
  apply: (characterState: CharacterState, functionConfig: FunctionConfig) => Quest | null;
};

function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) {
      // console.log(`访问路径 "${path}" 时遇到 undefined 或 null`);
      return undefined;
    }
    if (!(key in current)) {
      // console.log(`属性 "${key}" 在对象中不存在`);
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
  return {
    name: rule.name,
    apply: (characterState, functionConfig) => {
      if (conditionAllMatched(rule, characterState, functionConfig)) {
        let quest = evalQuest(rule.quest, characterState, functionConfig);
        if (quest.configMatched()) {
          return quest;
        }
      }
      return null;
    }
  };
}

function conditionAllMatched(rule: Rule, characterState: CharacterState, functionConfig: FunctionConfig) {
  for (const [key, condition] of Object.entries(rule.conditions)) {
    const value = getNestedValue({...characterState, ...functionConfig}, key);
    if (value === undefined) {
      // console.log(`规则 "${rule.name}": 条件 "${key}" 不满足 - 属性不存在或为 undefined`);
      return false;
    }
    
    // 检查其他条件
    if (condition.gt !== undefined && !(value > condition.gt)) {
      // console.log(`规则 "${rule.name}": 条件 "${key}" 不满足 - 值 ${value} 不大于 ${condition.gt}`);
      return false;
    }
    if (condition.lt !== undefined && !(value < condition.lt)) {
      // console.log(`规则 "${rule.name}": 条件 "${key}" 不满足 - 值 ${value} 不小于 ${condition.lt}`);
      return false;
    }
    // ... 其他条件检查 ...
    
    if (condition.enable !== undefined && !condition.enable) {
      // console.log(`规则 "${rule.name}": 条件 "${key}" 不满足 - 未启用`);
      return false;
    }
  }
  // console.log(`规则 "${rule.name}": 所有条件都满足`);
  return true;
}

function generateQuest(rules: RuleFunction[], characterState: CharacterState, functionConfig: FunctionConfig): Quest[] {
  let quests: Quest[] = [];
  for (const rule of rules) {
    const quest = rule.apply(characterState, functionConfig);
    if (quest) {
      // console.log(`Rule "${rule.name}" generated a quest: ${quest.constructor.name}`);
      quests.push(quest);
    } else {
      // console.log(`Rule "${rule.name}" did not generate a quest`);
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