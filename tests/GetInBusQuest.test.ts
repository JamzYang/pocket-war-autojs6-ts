import {createRuleFunction, generateQuest} from '../src/ruleEngine';
import {
  CharacterState,
  CollectCoinsQuest,
  FunctionConfig,
  GatherFoodQuest, GetInBusQuest,
  HuntType, NullQuest,
  SoloHuntQuest
} from '../src/types';
import {loadConfig} from '../src/configLoader';
import {ruleConfig} from '../src/condition';

import {characterState, functionConfig} from "../src/config/config";

const configPath = 'src/config.json';
const rules = ruleConfig.rules.map(createRuleFunction);
// 测试角色状态和功能配置


// 测试用例
describe('rally quest', () => {

  it('should generate rally food action when stamina is less than 10', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    // functionConfig.rallyHunt.enabled = true;
    functionConfig.getInBus.enabled = true;
    const quest = generateQuest(rules);
    expect(quest[0]).toBeInstanceOf(GetInBusQuest);
  });
});
