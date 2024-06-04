import {
  CharacterState,
  CollectCoinsQuest,
  FunctionConfig,
  GatherFoodQuest, GetInBusQuest,
  HuntType, NullQuest,
  SoloHuntQuest
} from '../src/types';


import {characterState, functionConfig} from "../src/config/config";
import {run} from "../src/ruleEngine";
import {loadRuleConfig} from "../src/condition";
import {loadFeatureConfig} from "../src/configLoader";


jest.mock('../src/configLoader', () => ({
  loadFeatureConfig: jest.fn().mockReturnValue(functionConfig)
}))

describe('generate Quest', () => {
  it('should generate correct Quest based on character state and function config', () => {
    characterState.idleTeams = 1;
    characterState.stamina = 60;
    functionConfig.soloHunt.enabled = true;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(SoloHuntQuest);
  });

  it('should generate gather food action when stamina is less than 10', () => {
    characterState.stamina = 5;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    functionConfig.getInBus.enabled = false;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GatherFoodQuest);
  });

  it('should generate collect coins action when idle teams are zero and time since last coin collection is more than 1 hour', () => {
    characterState.idleTeams = 0;
    functionConfig.collectCoins = true;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(CollectCoinsQuest);
  });

  it('should return null if no conditions match', () => {
    characterState.idleTeams = 0;
    functionConfig.collectCoins = false;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, functionConfig)
    expect(quests.length).toBe(0);
  });

  it('should gen GetInBus, GatherFood when stamina > 20 and idleTeams > 0', () => {
    characterState.stamina =30;
    characterState.idleTeams = 1;
    functionConfig.gatherFood = true;
    functionConfig.getInBus.enabled = true;
    functionConfig.getInBus.chuizi.enabled= true;
    functionConfig.getInBus.chuizi.times = 1;
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, functionConfig)
    expect(quests[0]).toBeInstanceOf(GetInBusQuest);
    expect(quests[1]).toBeInstanceOf(GatherFoodQuest);
  });
});
