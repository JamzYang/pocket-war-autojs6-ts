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

const configPath = 'src/config.json';
// 测试角色状态和功能配置


// 测试用例
describe('rally quest', () => {

  it('should generate rally food action when stamina is less than 10', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    // functionConfig.rallyHunt.enabled = true;
    functionConfig.getInBus.enabled = true;
    let quests = run()
    expect(quests[0]).toBeInstanceOf(GetInBusQuest);
  });
});
