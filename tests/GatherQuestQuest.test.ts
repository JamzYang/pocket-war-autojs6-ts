import {GatherType, HuntType} from "../src/enum";
import {characterState, functionConfig} from "../src/config/config";
import {loadFeatureConfig} from "../src/core/configLoader";
import * as autoHandler from "../src/helper/autoHandler";
import {fromBase64} from "../src/helper/autoHandler";
import {iconConfig} from "../src/config/iconConfig";
import {SuccessResult} from "../src/core/executeResult";
import * as stepModule from "../src/core/step";
import {run} from "../src/core/ruleEngine";
import {GatherQuest} from "../src/gather";
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

describe('gather Quest', () => {
  it('gather ', () => {
    let mockFunctionConfig = JSON.parse(JSON.stringify(UIConfig2));
    characterState.idleTeams = 1;
    // mockFunctionConfig.gather.enabled = true;
    // mockFunctionConfig.gather.team1.enabled = true;
    // mockFunctionConfig.gather.team2.enabled = true;

    (loadFeatureConfig as jest.Mock).mockReturnValue(mockFunctionConfig);

    //mock 选中英雄
    (autoHandler.matchTemplate as jest.Mock).mockImplementation((img, template, options) => {
      let noHeroPic = fromBase64(iconConfig.heroSelectBlank.base64);
      if (noHeroPic == template) {
        return { matches: [], points: [] };
      }
      return { matches: [], points: [{x: 100, y: 100}] };
    });

    //mock 到世界
    const mockToWorldExecute = jest.fn().mockReturnValue(new SuccessResult('Mocked ToWorld'));
    jest.spyOn(stepModule.ToWorld.prototype, 'execute').mockImplementation(mockToWorldExecute);


    let quests = run(characterState, mockFunctionConfig)

    let quest = quests[0]
    quest.preExecute()
    let questResult=  quest.execute()
    quest.postExecute(questResult)
    let gatherQuest = quest as GatherQuest
    expect(mockFunctionConfig.gather[gatherQuest.teamNum].enabled).toBe(false);

    let quests2 = run(characterState, mockFunctionConfig)

    let quest2 = quests2[0]
    quest2.preExecute()
    let questResult2=  quest2.execute()
    quest2.postExecute(questResult2)
    let gatherQuest2 = quest as GatherQuest
    expect(mockFunctionConfig.gather[gatherQuest2.teamNum].enabled).toBe(false);

  });
},);



const UIConfig = {
  freeDiamond: false,
  collectCoins: false,
  expedition: false,
  soloHunt: {
    enabled: false,
    type: "左一",
    attackType: "五连",
    times: 1,
    formationNum: "1"
  },
  rallyHunt: {
    enabled: false,
    chuizi: {
      enabled: false,
      times: 1,
      level: 0,
      formationNum: 1
    },
    juxing: {
      enabled: false,
      times: 10,
      level: 0,
      formationNum: 1
    },
    right: {
      enabled: false,
      times: 10,
      level: 0,
      formationNum: 1
    },
    nanmin: {
      enabled: false,
      times: 10,
      formationNum: 1
    },
    heijun: {
      enabled: false,
      formationNum: 1
    },
  },
  gather: {
    enabled: false,
    team1: { enabled: false, formationNum: "1", type:GatherType.Oil },
    team2: { enabled: false, formationNum: "2", type:GatherType.Food },
    team3: { enabled: false, formationNum: "3", type:GatherType.Oil },
    team4: { enabled: false, formationNum: "4", type:GatherType.Food },
    team5: { enabled: false, formationNum: "0", type:GatherType.Oil },
    team6: { enabled: false, formationNum: "0", type:GatherType.Oil },
    team7: { enabled: false, formationNum: "0", type:GatherType.Oil },
    team8: { enabled: false, formationNum: "0", type:GatherType.Oil },
  },
  getInBus: {
    enabled: false,
    chuizi: {
      enabled: false,
      times: "50"
    },
    heijun: {
      enabled: false,
      times: "50"
    },
    nanmin: {
      enabled: false,
      times: "10"
    },
    juxing: {
      enabled: false,
      times: "10"
    },
    formationNum: "1"
  },
  events: {
    oceanTreasure: {
      enabled: false,
      detectorNum: "3"
    }
  }
};

const UIConfig2 ={"freeDiamond":false,"collectCoins":false,"expedition":false,"soloHunt":{"enabled":false,"type":"左一","attackType":"五连","times":1,"formationNum":"1"},"rallyHunt":{"enabled":false,"chuizi":{"enabled":false,"times":1,"level":0,"formationNum":1},"juxing":{"enabled":false,"times":10,"level":0,"formationNum":1},"right":{"enabled":false,"times":10,"level":0,"formationNum":1},"nanmin":{"enabled":false,"times":10,"formationNum":1},"heijun":{"enabled":false,"formationNum":1}},"gather":{"enabled":true,"team1":{"enabled":false,"formationNum":"1","type":"Food"},"team2":{"enabled":false,"formationNum":"2","type":"Oil"},"team3":{"enabled":false,"formationNum":"3","type":"Oil"},"team4":{"enabled":false,"formationNum":"4","type":"Thor"},"team5":{"enabled":false,"formationNum":0,"type":"石油"},"team6":{"enabled":true,"formationNum":"6","type":"Food"},"team7":{"enabled":true,"formationNum":"7","type":"Oil"},"team8":{"enabled":true,"formationNum":"8","type":"Thor"}},"getInBus":{"enabled":false,"chuizi":{"enabled":false,"times":"50"},"heijun":{"enabled":false,"times":"50"},"nanmin":{"enabled":false,"times":"10"},"juxing":{"enabled":false,"times":"10"},"formationNum":"1"},"events":{"oceanTreasure":{"enabled":false,"detectorNum":"3"}}}