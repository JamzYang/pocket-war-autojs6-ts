import {createRuleFunction, generateQuest} from '../src/ruleEngine';
import {
  CharacterState,
  CollectCoinsQuest,
  FunctionConfig,
  GatherFoodQuest,
  HuntType, NullQuest,
  SoloHuntQuest
} from '../src/types';
import {loadConfig} from '../src/configLoader';
import {ruleConfig} from '../src/condition';

import {characterState, functionConfig} from "../src/config";

const configPath = 'src/config.json';
const rules = ruleConfig.rules.map(createRuleFunction);
// 测试角色状态和功能配置


// 测试用例
describe('generate Quest', () => {
  it('should generate correct Quest based on character state and function config', () => {
    characterState.idleTeams = 1;
    characterState.stamina = 60;
    functionConfig.soloHunt.enabled = true;

    // 检查是否生成了正确的指令
    const action = generateQuest(rules);
    expect(action[0]).toBeInstanceOf(SoloHuntQuest);
  });

  it('should generate gather food action when stamina is less than 10', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    const action = generateQuest(rules);
    expect(action[0]).toBeInstanceOf(GatherFoodQuest);
  });

  it('should generate collect coins action when idle teams are zero and time since last coin collection is more than 1 hour', () => {
    characterState.idleTeams = 0;
    functionConfig.collectCoins = true;
    const action = generateQuest(rules);
    expect(action[0]).toBeInstanceOf(CollectCoinsQuest);
  });

  it('should return null if no conditions match', () => {
    characterState.idleTeams = 0;
    functionConfig.collectCoins = false;

    const action = generateQuest(rules);
    expect(action.length).toBe(0);
  });
});
