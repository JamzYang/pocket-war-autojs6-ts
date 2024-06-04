import {run} from '../src/ruleEngine';
import {
  CharacterState,
  CollectCoinsQuest,
  FunctionConfig,
  GatherFoodQuest, GetInBusQuest,
  HuntType, NullQuest, Quest,
  SoloHuntQuest
} from '../src/types';

import {characterState, functionConfig} from "../src/config/config";
import {loadRuleConfig} from "../src/condition";

const configPath = 'src/config.json';
// 测试角色状态和功能配置


jest.mock('../src/configLoader', () => ({
  loadFeatureConfig: jest.fn().mockReturnValue(functionConfig)
}))

// 测试用例
describe('rally quest', () => {

  it('should generate gather food action when no enemy is enabled', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    // functionConfig.rallyHunt.enabled = true;
    functionConfig.getInBus.enabled = true;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig, characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GatherFoodQuest);
  });

  it('should generate gather food action when no enemy times greater than 0', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    // functionConfig.rallyHunt.enabled = true;
    functionConfig.getInBus.enabled = true;
    functionConfig.getInBus.chuizi.enabled = true;
    functionConfig.getInBus.chuizi.times = -1;
    functionConfig.getInBus.heijun.enabled = true;
    functionConfig.getInBus.heijun.times = -1;
    functionConfig.getInBus.nanmin.enabled = true;
    functionConfig.getInBus.nanmin.times = -1;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig, characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GatherFoodQuest);

  });


  it('should generate gather food action when some enemy times greater than 0', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    // functionConfig.rallyHunt.enabled = true;
    functionConfig.getInBus.enabled = true;
    functionConfig.getInBus.chuizi.enabled = true;
    functionConfig.getInBus.chuizi.times = 1;
    functionConfig.getInBus.heijun.enabled = true;
    functionConfig.getInBus.heijun.times = -1;
    functionConfig.getInBus.nanmin.enabled = true;
    functionConfig.getInBus.nanmin.times = -1;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig, characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GetInBusQuest);
  });
});
