import {characterState, functionConfig} from "../src/config/config";
import {run} from "../src/core/ruleEngine";
import {loadRuleConfig} from "../src/core/condition";
import {OceanTreasureQuest} from "../src/oceanTreasure";
import {RallyHuntQuest, SoloHuntQuest} from "../src/hunt";
import {GatherFoodQuest} from "../src/gather";
import {CollectCoinsQuest} from "../src/collectCoins";
import {GetInBusQuest} from "../src/getInBus";
import {HuntType} from "../src/enum";
import * as autoHandler from "../src/helper/autoHandler";
import {loadFeatureConfig} from "../src/core/configLoader";
import {captureScreen, findImage, fromBase64, matchTemplate} from "../src/helper/autoHandler";
import {iconConfig} from "../src/config/iconConfig";

import * as stepModule from "../src/core/step";
import {SuccessResult} from "../src/core/executeResult";

// import * as configLoader from "../src/core/configLoader"

// jest.mock('../src/core/configLoader', () => ({
//   loadFeatureConfig: jest.fn().mockReturnValue(functionConfig)
// }))

jest.mock('../src/core/configLoader', () => ({
  loadFeatureConfig: jest.fn()
}))

jest.mock('../src/helper/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
  fromBase64: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  captureScreen: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  findImage: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  findMultiColor: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  myClick: jest.fn().mockReturnValue(true),
  clickPoint: jest.fn().mockReturnValue(true),
  mySwipe: jest.fn().mockReturnValue(true),
  matchTemplate: jest.fn(), // 默认 mock 函数
  ocrTextFromImg: jest.fn().mockReturnValue([{label:'战锤'}]),
  ocrText: jest.fn().mockReturnValue(['战锤']),
  mySleep: jest.fn(),
}));


describe('generate Quest', () => {

  it('should generate correct Quest based on character state and function config', () => {
    let mockFunctionConfig =  JSON.parse(JSON.stringify(functionConfig));

    characterState.idleTeams = 1;
    characterState.stamina = 60;
    mockFunctionConfig.soloHunt.enabled = true;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests[0]).toBeInstanceOf(SoloHuntQuest);
  });

  it('should generate gather food action when stamina is less than 10', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.stamina = 5;
    characterState.idleTeams = 1;
    mockFunctionConfig.gatherFood = true;
    mockFunctionConfig.getInBus.enabled = false;

    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests[0]).toBeInstanceOf(GatherFoodQuest);
  });

  it('should generate collect coins action when idle teams are zero and time since last coin collection is more than 1 hour', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.idleTeams = 0;
    mockFunctionConfig.collectCoins = true;

    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests[0]).toBeInstanceOf(CollectCoinsQuest);
  });

  it('should return null if no conditions match', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.idleTeams = 0;
    mockFunctionConfig.collectCoins = false;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests.length).toBe(0);
  });

  it('should gen GetInBus, GatherFood when stamina > 20 and idleTeams > 0', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.stamina =30;
    characterState.idleTeams = 1;
    mockFunctionConfig.gatherFood = true;
    mockFunctionConfig.getInBus.enabled = true;
    mockFunctionConfig.getInBus.chuizi.enabled= true;
    mockFunctionConfig.getInBus.chuizi.times = 1;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests[0]).toBeInstanceOf(GetInBusQuest);
    expect(quests[1]).toBeInstanceOf(GatherFoodQuest);
  });

  it('should gen nonTeamNeedQuest when idleTeams = 0', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.stamina =30;
    characterState.idleTeams = 0;
    mockFunctionConfig.gatherFood = true;
    mockFunctionConfig.getInBus.enabled = true;
    mockFunctionConfig.getInBus.chuizi.enabled= true;
    mockFunctionConfig.getInBus.chuizi.times = 1;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    // expect(quests[0]).toBeInstanceOf(GetInBusQuest); //todo
  });

  it('should gen oceanTreasureQuest when treasure is enabled', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.stamina =30;
    characterState.idleTeams = 1;
    mockFunctionConfig.gatherFood = true;
    // mockFunctionConfig.getInBus.enabled = true;
    // mockFunctionConfig.getInBus.chuizi.enabled= true;
    // mockFunctionConfig.getInBus.chuizi.times = 1;
    mockFunctionConfig.events.oceanTreasure.enabled = true;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests[0]).toBeInstanceOf(OceanTreasureQuest);
  });


  it('solo times should be same when quest fail ', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));
    characterState.stamina =35;
    characterState.idleTeams = 1;
    mockFunctionConfig.soloHunt.enabled = true;
    mockFunctionConfig.soloHunt.type = HuntType.navy;
    mockFunctionConfig.soloHunt.attackType = "单次";
    mockFunctionConfig.soloHunt.times = 2;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    //mock 没有选中英雄
    (autoHandler.matchTemplate as jest.Mock).mockImplementation((img, template, options) => {
      let noHeroPic = fromBase64(iconConfig.heroSelectBlank.base64);
      if (noHeroPic == template) {
        return { matches: [], points: [{x: 100, y: 100}] };
      }
      return { matches: [], points: [] };
    });

    const mockToWorldExecute = jest.fn().mockReturnValue(new SuccessResult('Mocked ToWorld'));
    jest.spyOn(stepModule.ToWorld.prototype, 'execute').mockImplementation(mockToWorldExecute);

    //mock 到世界
    let ruleConfig = loadRuleConfig()

    let quests = run(ruleConfig,characterState, mockFunctionConfig)

    let quest = quests[0]
    let questResult=  quest.execute()
    quest.postExecute(questResult)
    expect(mockFunctionConfig.soloHunt.times).toBe(2);
    expect(questResult.message).toContain('NoHeroSelectedError');
  });

  it('should gen solo quest', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));
    //characterState是全局, 容易被污染,用之前清一下.
    characterState.lastQuests.clear()
    characterState.stamina =35;
    characterState.idleTeams = 1;
    mockFunctionConfig.gatherFood = true;
    mockFunctionConfig.getInBus.enabled = true;
    mockFunctionConfig.getInBus.chuizi.enabled= true;
    mockFunctionConfig.getInBus.chuizi.times = 1;
    mockFunctionConfig.soloHunt.enabled = true;
    mockFunctionConfig.soloHunt.type = HuntType.navy;
    mockFunctionConfig.soloHunt.attackType = "单次";
    mockFunctionConfig.soloHunt.times = 2;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests[0]).toBeInstanceOf(SoloHuntQuest); //todo
  });


  it('should gen no quest when hunt enabled but times is 0', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.stamina =35;
    characterState.idleTeams = 1;

    mockFunctionConfig.soloHunt.enabled = true;
    mockFunctionConfig.soloHunt.type = HuntType.navy;
    mockFunctionConfig.soloHunt.attackType = "单次";
    mockFunctionConfig.soloHunt.times = 0;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);
    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    expect(quests.length).toBe(0);
  });

  it('should gen rally quest', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.stamina =45;
    characterState.idleTeams = 1;
    mockFunctionConfig.gatherFood = true;
    mockFunctionConfig.getInBus.enabled = true;
    mockFunctionConfig.getInBus.chuizi.enabled= true;
    mockFunctionConfig.getInBus.chuizi.times = 1;
    mockFunctionConfig.soloHunt.enabled = false;
    mockFunctionConfig.soloHunt.type = HuntType.navy;
    mockFunctionConfig.soloHunt.attackType = "五连";
    mockFunctionConfig.soloHunt.times = 2;

    mockFunctionConfig.rallyHunt.enabled = true;
    mockFunctionConfig.rallyHunt.chuizi.enabled = true;
    mockFunctionConfig.rallyHunt.chuizi.times = 1;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)

    let conname = quests[0].constructor.name;
    console.log(conname)
    expect(quests[0]).toBeInstanceOf(RallyHuntQuest);
  });


  it('rally times should be same when quest fail ', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));
    characterState.stamina =35;
    characterState.idleTeams = 1;
    mockFunctionConfig.rallyHunt.enabled = true;
    mockFunctionConfig.rallyHunt.chuizi.enabled = true;
    mockFunctionConfig.rallyHunt.chuizi.times = 2;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    //mock 没有选中英雄
    (autoHandler.matchTemplate as jest.Mock).mockImplementation((img, template, options) => {
      let noHeroPic = fromBase64(iconConfig.heroSelectBlank.base64);
      if (noHeroPic == template) {
        return { matches: [], points: [{x: 100, y: 100}] };
      }
      return { matches: [], points: [] };
    });

    //mock 到世界
    const mockToWorldExecute = jest.fn().mockReturnValue(new SuccessResult('Mocked ToWorld'));
    jest.spyOn(stepModule.ToWorld.prototype, 'execute').mockImplementation(mockToWorldExecute);

    let ruleConfig = loadRuleConfig()

    let quests = run(ruleConfig,characterState, mockFunctionConfig)

    let quest = quests[0]
    let questResult=  quest.execute()
    quest.postExecute(questResult)
    expect(mockFunctionConfig.rallyHunt.chuizi.times).toBe(2);
    expect(questResult.message).toContain('NoHeroSelectedError');

    //第一次失败后,第二次不会再生成任务
    let quests2 = run(ruleConfig,characterState, mockFunctionConfig)
    let quest2 = quests2[0]
    expect(quests2.length).toBe(0);
  });


  it('if no diamond to take,FreeDiamondQuest should not run again ', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));
    characterState.stamina =35;
    characterState.idleTeams = 1;
    mockFunctionConfig.freeDiamond = true;
    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    //mock 没有选中英雄
    (autoHandler.findImage as jest.Mock).mockImplementation((img, template, options) => {
      let noHeroPic = fromBase64(iconConfig.takeDiamondGrayBtn.base64);
      return { matches: [], points: [] };
    });

    const mockToCityExecute = jest.fn().mockReturnValue(new SuccessResult('Mocked ToWorld'));
    jest.spyOn(stepModule.ToCity.prototype, 'execute').mockImplementation(mockToCityExecute);

    //mock 到城市
    let ruleConfig = loadRuleConfig()

    let quests = run(ruleConfig,characterState, mockFunctionConfig)

    let quest = quests[0]
    let questResult=  quest.execute()
    quest.postExecute(questResult)
    // expect(questResult.message).toContain('NoHeroSelectedError');

    //第一次失败后,第二次不会再生成任务
    let quests2 = run(ruleConfig,characterState, mockFunctionConfig)
    let quest2 = quests2[0]
    expect(quests2.length).toBe(0);
  });




  it('单刷 五连 点击左边', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));

    characterState.stamina =45;
    characterState.idleTeams = 1;

    mockFunctionConfig.soloHunt.enabled = true;
    mockFunctionConfig.soloHunt.type = HuntType.navy;
    mockFunctionConfig.soloHunt.attackType = "五连";
    mockFunctionConfig.soloHunt.times = 2;

    // mockFunctionConfig.rallyHunt.enabled = true;
    // mockFunctionConfig.rallyHunt.chuizi.enabled = true;
    // mockFunctionConfig.rallyHunt.chuizi.times = 1;

    //mock 到世界
    const mockToWorldExecute = jest.fn().mockReturnValue(new SuccessResult('Mocked ToWorld'));
    jest.spyOn(stepModule.ToWorld.prototype, 'execute').mockImplementation(mockToWorldExecute);

    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    quests[0].execute()
  });

  it('集结 惧星 点击左边', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(functionConfig));
    characterState.stamina =45;
    characterState.idleTeams = 1;

    mockFunctionConfig.rallyHunt.enabled = true;
    mockFunctionConfig.rallyHunt.juxing.enabled = true;
    mockFunctionConfig.rallyHunt.juxing.times = 1;

    //mock 到世界
    const mockToWorldExecute = jest.fn().mockReturnValue(new SuccessResult('Mocked ToWorld'));
    jest.spyOn(stepModule.ToWorld.prototype, 'execute').mockImplementation(mockToWorldExecute);

    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    let ruleConfig = loadRuleConfig()
    let quests = run(ruleConfig,characterState, mockFunctionConfig)
    quests[0].execute()
  });
});
