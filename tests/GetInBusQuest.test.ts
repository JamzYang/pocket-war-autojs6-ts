import {run} from '../src/core/ruleEngine';

import {characterState, functionConfig} from "../src/config/config";
import {loadRuleConfig} from "../src/core/condition";
import {GatherQuest} from "../src/gather";
import {GetInBusQuest} from "../src/getInBus";

const configPath = 'src/config.json';
// 测试角色状态和功能配置


jest.mock('../src/core/configLoader', () => ({
  loadFeatureConfig: jest.fn().mockReturnValue(functionConfig)
}))

// 测试用例
describe('rally quest', () => {

  it('should generate gather food action when no enemy is enabled', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gather.enabled = true;
    functionConfig.gather.team1.enabled = true;

    // functionConfig.rallyHunt.enabled = true;
    functionConfig.getInBus.enabled = true;
    let quests = run(characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GatherQuest);
  });

  it('should generate gather food action when no enemy times greater than 0', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gather.enabled = true;
    functionConfig.gather.team1.enabled = true;
    functionConfig.getInBus.enabled = true;
    functionConfig.getInBus.chuizi.enabled = true;
    functionConfig.getInBus.chuizi.times = -1;
    functionConfig.getInBus.heijun.enabled = true;
    functionConfig.getInBus.heijun.times = -1;
    functionConfig.getInBus.nanmin.enabled = true;
    functionConfig.getInBus.nanmin.times = -1;
    let quests = run(characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GatherQuest);

  });


  it('should generate gather food action when some enemy times greater than 0', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gather.enabled = true;
    functionConfig.gather.team1.enabled = true;
    functionConfig.getInBus.enabled = true;
    functionConfig.getInBus.chuizi.enabled = true;
    functionConfig.getInBus.chuizi.times = 1;
    functionConfig.getInBus.heijun.enabled = true;
    functionConfig.getInBus.heijun.times = -1;
    functionConfig.getInBus.nanmin.enabled = true;
    functionConfig.getInBus.nanmin.times = -1;
    let quests = run(characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GetInBusQuest);
  });
});
